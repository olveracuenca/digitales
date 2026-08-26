class View {
  constructor() {
    this.chartPresupuestoInstance = null;
    this.chartProyeccionInstance = null;
    this.lucide = window.lucide;
  }

  updateHero(currWeek, appState, weeks, currIdx) {
    document.getElementById('currentWeekBadge').innerText = `Semana ${currWeek.num.toString().padStart(2, '0')}`;
    document.getElementById('currentDateRange').innerText = `${currWeek.periodStr} (${currWeek.monthStr})`;

    document.getElementById('heroSemanaTitle').innerText = `Semana ${currWeek.num.toString().padStart(2, '0')} • ${currWeek.quincenaStr}`;
    document.getElementById('heroPeriodo').innerText = currWeek.periodStr;

    if (currWeek.scheduledItems.length > 0) {
      const itemNames = currWeek.scheduledItems.map(x => `<strong class="text-white">${x.name} ($${x.monto.toLocaleString()})</strong>`).join(', ');
      document.getElementById('heroVencimientosTexto').innerHTML = `Vencimientos programados esta semana: ${itemNames}`;
    } else {
      document.getElementById('heroVencimientosTexto').innerHTML = `Sin vencimientos de deudas programados esta semana. Mantén tu flujo en orden.`;
    }

    const totalDeuda = appState.debts.reduce((acc, d) => acc + (d.restante > 0 ? d.restante : 0), 0);
    document.getElementById('kpiDeudaTotal').innerText = `$${totalDeuda.toLocaleString()}`;

    const weekTx = appState.transactions.filter(t => t.semanaNum === currWeek.num && t.tipo === 'GASTO');
    const realSpent = weekTx.reduce((acc, t) => acc + Number(t.monto), 0);
    document.getElementById('heroGastoReal').innerText = `$${realSpent.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    
    // Compute cumulative rolling balance up to current week
    let rollingBalance = 0;
    for (let i = 0; i <= currIdx; i++) {
        const w = weeks[i];
        const wTxs = appState.transactions.filter(t => t.semanaNum === w.num);
        const wGastado = wTxs.filter(t => t.tipo === 'GASTO').reduce((a, b) => a + Number(b.monto), 0);
        const wIngresos = w.baseIncome + wTxs.filter(t => t.tipo === 'INGRESO').reduce((a, b) => a + Number(b.monto), 0);
        rollingBalance += (wIngresos - wGastado);
    }

    document.getElementById('heroRemanente').innerText = `$${rollingBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    document.getElementById('heroRemanente').className = `text-2xl md:text-3xl font-black tracking-tight drop-shadow-md ${rollingBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
  }

  renderCharts(appState) {
    const ctx1 = document.getElementById('chartPresupuesto').getContext('2d');
    if (this.chartPresupuestoInstance) this.chartPresupuestoInstance.destroy();

    this.chartPresupuestoInstance = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Gastos Fijos & Deudas', 'Ahorro / Metas', 'Gustos & Ocio', 'Fondo Imprevistos'],
        datasets: [{
          data: [15450, appState.ahorroMeta, appState.gustosMeta, appState.imprevistosMeta],
          backgroundColor: ['#f43f5e', '#10b981', '#a855f7', '#0ea5e9'],
          borderColor: '#0f172a',
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 } } }
        }
      }
    });

    const ctx2 = document.getElementById('chartProyeccion').getContext('2d');
    if (this.chartProyeccionInstance) this.chartProyeccionInstance.destroy();

    const labels = ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const deudaData = [115800, 106000, 96200, 86400, 76600, 66800, 59500, 53700, 48700, 44000, 40000, 36000, 32000, 28000, 24000, 20000, 16000];
    const ahorroData = [1000, 3000, 5000, 7000, 13000, 15000, 19500, 25500, 32300, 39400, 47200, 55000, 62800, 70600, 78400, 86200, 100200];

    this.chartProyeccionInstance = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Saldo Deuda Total',
            data: deudaData,
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Ahorro Acumulado Proyectado',
            data: ahorroData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 } } }
        },
        scales: {
          x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: '#1e293b', borderDash: [5, 5] } },
          y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: '#1e293b', borderDash: [5, 5] } }
        }
      }
    });
  }

  renderWeeks(weeks, currentWeekIdx, appState, togglePaymentCallback) {
    const container = document.getElementById('weeksContainer');
    const query = (document.getElementById('filtroSemana')?.value || '').toLowerCase();
    container.innerHTML = '';

    let rollingBalance = 0;

    weeks.forEach((w, idx) => {
      const isCurrent = idx === currentWeekIdx;

      const weekTxs = appState.transactions.filter(t => t.semanaNum === w.num);
      const totalGastado = weekTxs.filter(t => t.tipo === 'GASTO').reduce((a, b) => a + Number(b.monto), 0);
      const totalIngresos = w.baseIncome + weekTxs.filter(t => t.tipo === 'INGRESO').reduce((a, b) => a + Number(b.monto), 0);
      const balance = totalIngresos - totalGastado;

      rollingBalance += balance;
      
      const matchText = `${w.num} ${w.periodStr} ${w.monthStr} ${w.quincenaStr} ${w.scheduledItems.map(i=>i.name).join(' ')}`.toLowerCase();
      if (query && !matchText.includes(query)) return;

      const card = document.createElement('div');
      card.className = `p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
        isCurrent 
          ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-emerald-500/50 shadow-emerald-900/20' 
          : 'bg-slate-900/50 backdrop-blur-md border-slate-800/80 hover:border-slate-700'
      }`;

      let scheduledHtml = '';
      if (w.scheduledItems.length > 0) {
        scheduledHtml = `
          <div class="mt-4 pt-4 border-t border-slate-800/50 space-y-3">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="calendar-clock" class="w-4 h-4"></i> Vencimientos & Pagos Programados
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${w.scheduledItems.map(item => {
                const itemPaidKey = `paid-${w.num}-${item.key}`;
                const isPaid = !!appState.paidItemsByWeek[itemPaidKey];
                return `
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                    isPaid 
                      ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                      : 'bg-slate-950/80 border-slate-800'
                  }">
                    <div class="flex items-center gap-3 mb-2 sm:mb-0">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center ${isPaid ? 'bg-emerald-500/20' : 'bg-slate-800'}">
                        <i data-lucide="${isPaid ? 'check' : 'circle-dollar-sign'}" class="w-4 h-4 ${isPaid ? 'text-emerald-400' : 'text-slate-400'}"></i>
                      </div>
                      <div>
                        <p class="text-sm font-bold ${isPaid ? 'text-emerald-100' : 'text-slate-200'}">${item.name}</p>
                        <p class="text-xs ${isPaid ? 'text-emerald-400/80' : 'text-slate-400'} font-medium">$${item.monto.toLocaleString()} MXN</p>
                      </div>
                    </div>
                    <button data-action="toggle-payment" data-key="${itemPaidKey}" data-name="${item.name}" data-monto="${item.monto}" data-sem="${w.num}" data-debt="${item.debtId || ''}" 
                      class="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        isPaid 
                          ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-900/40' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600'
                      }">
                      ${isPaid ? 'PAGADO ✅' : 'Marcar Pagado'}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="flex flex-col items-center justify-center w-14 h-14 rounded-2xl ${isCurrent ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-300'}">
              <span class="text-[10px] font-bold uppercase tracking-wider opacity-80">Sem</span>
              <span class="text-xl font-black">${w.num.toString().padStart(2, '0')}</span>
            </div>
            <div>
              <h4 class="text-base font-bold text-white flex items-center gap-2">
                ${w.periodStr}
                ${isCurrent ? '<span class="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Actual</span>' : ''}
              </h4>
              <p class="text-sm text-slate-400 font-medium">${w.quincenaStr} • ${w.monthStr}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-4">
            <div class="flex gap-4 text-xs font-medium mr-2">
              <div class="flex flex-col">
                <span class="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Ingresos</span>
                <span class="text-emerald-400/80">$${totalIngresos.toLocaleString()}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Gastos</span>
                <span class="text-rose-400/80">$${totalGastado.toLocaleString()}</span>
              </div>
            </div>
            <div class="px-3 sm:px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800/80 shadow-inner min-w-[80px] sm:min-w-[100px] text-center flex flex-col justify-center">
              <span class="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Flujo Sem.</span>
              <span class="text-sm font-black ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}">$${balance.toLocaleString()}</span>
            </div>
            <div class="px-3 sm:px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 shadow-inner min-w-[80px] sm:min-w-[100px] text-center flex flex-col justify-center">
              <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Acumulado</span>
              <span class="text-sm font-black ${rollingBalance >= 0 ? 'text-emerald-300' : 'text-rose-300'}">$${rollingBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
        ${scheduledHtml}
      `;

      container.appendChild(card);
    });

    document.querySelectorAll('[data-action="toggle-payment"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const t = e.currentTarget;
        togglePaymentCallback(
          t.dataset.key, 
          t.dataset.name, 
          t.dataset.monto, 
          t.dataset.sem, 
          t.dataset.debt
        );
      });
    });

    if (this.lucide) this.lucide.createIcons();
  }

  renderDebts(appState, quickPayCallback) {
    const container = document.getElementById('debtsContainer');
    container.innerHTML = '';

    appState.debts.forEach(d => {
      const isLiquidada = d.restante <= 0;
      const progressPct = Math.min(100, Math.round(((d.inicial - d.restante) / d.inicial) * 100));

      const card = document.createElement('div');
      card.className = `p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
        isLiquidada 
          ? 'bg-emerald-950/20 border-emerald-500/30' 
          : 'bg-slate-900/50 backdrop-blur-md border-slate-800 hover:border-slate-700'
      }`;

      card.innerHTML = `
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2.5 mb-1">
              <div class="w-8 h-8 rounded-full flex items-center justify-center ${isLiquidada ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}">
                <i data-lucide="${isLiquidada ? 'party-popper' : 'credit-card'}" class="w-4 h-4 ${isLiquidada ? 'text-emerald-400' : 'text-indigo-400'}"></i>
              </div>
              <h4 class="text-base font-bold text-white">${d.nombre}</h4>
              <span class="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase ${
                isLiquidada ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }">${isLiquidada ? 'Liquidada' : 'Activa'}</span>
            </div>
            <p class="text-xs text-slate-400 font-medium pl-10">${d.acreedor} • Corte: ${d.quincena}</p>
          </div>
          <div class="text-right flex flex-col justify-between h-full">
            <p class="text-sm font-black text-white">$${d.mensual.toLocaleString()} <span class="text-[10px] text-slate-400 font-normal">/ mes</span></p>
            <p class="text-[10px] text-slate-400 mt-1">Fin: <strong class="text-slate-300">${d.fin}</strong></p>
          </div>
        </div>

        <div class="mt-5 pl-10">
          <div class="flex justify-between text-xs font-bold mb-2">
            <span class="text-slate-400">Restante: <span class="text-white text-sm">$${d.restante.toLocaleString()}</span></span>
            <span class="${isLiquidada ? 'text-emerald-400' : 'text-indigo-400'} bg-slate-950 px-2 py-0.5 rounded-md">${progressPct}% Pagado</span>
          </div>
          <div class="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800/50 shadow-inner">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out" style="width: ${progressPct}%"></div>
          </div>
        </div>

        <div class="mt-5 pt-4 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 pl-10">
          <span class="text-xs font-medium text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800/50">Monto Inicial: $${d.inicial.toLocaleString()}</span>
          ${!isLiquidada ? `
            <button data-action="quick-pay" data-id="${d.id}" class="w-full sm:w-auto text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white transition-all shadow-lg shadow-emerald-900/30 active:scale-95 flex items-center justify-center gap-2">
              <i data-lucide="zap" class="w-4 h-4"></i> Abono Rápido ($${d.mensual.toLocaleString()})
            </button>
          ` : `
            <span class="text-xs font-bold text-emerald-400 flex items-center gap-1"><i data-lucide="check-check" class="w-4 h-4"></i> Deuda saldada</span>
          `}
        </div>
      `;
      container.appendChild(card);
    });

    document.querySelectorAll('[data-action="quick-pay"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        quickPayCallback(e.currentTarget.dataset.id);
      });
    });

    if (this.lucide) this.lucide.createIcons();
  }

  renderFixedExpenses(appState) {
    const container = document.getElementById('fixedExpensesContainer');
    container.innerHTML = '';

    appState.fixedExpenses.forEach(f => {
      const card = document.createElement('div');
      card.className = "bg-slate-900/60 backdrop-blur p-4 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between group";
      card.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
            <i data-lucide="receipt-text" class="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors"></i>
          </div>
          <div>
            <p class="text-sm font-bold text-white">${f.concepto}</p>
            <p class="text-[11px] text-slate-400 font-medium">${f.categoria} • Día ${f.dia}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm font-black text-emerald-400">$${f.monto.toLocaleString()}</p>
          <span class="text-[9px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800/50 uppercase tracking-wider font-bold">${f.quincena === 'Quincena 1' ? 'Q1' : 'Q2'}</span>
        </div>
      `;
      container.appendChild(card);
    });
    if (this.lucide) this.lucide.createIcons();
  }

  renderTransactions(appState, deleteCallback) {
    const tbody = document.getElementById('transactionsTableBody');
    const noMsg = document.getElementById('noTransactionsMsg');
    const catFilter = document.getElementById('filterCategory')?.value || 'ALL';

    tbody.innerHTML = '';
    const filtered = appState.transactions.filter(t => catFilter === 'ALL' || t.categoria === catFilter);

    if (filtered.length === 0) {
      noMsg.classList.remove('hidden');
      return;
    } else {
      noMsg.classList.add('hidden');
    }

    filtered.forEach(t => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-800/40 transition-colors border-b border-slate-800/50 last:border-0";
      const isIngreso = t.tipo === 'INGRESO';

      tr.innerHTML = `
        <td class="py-3 px-4 text-xs text-slate-400 font-medium">${t.fecha}</td>
        <td class="py-3 px-4"><span class="bg-slate-900 border border-slate-700 text-slate-300 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">Sem ${t.semanaNum}</span></td>
        <td class="py-3 px-4 font-bold text-white">${t.concepto}</td>
        <td class="py-3 px-4"><span class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 bg-slate-900 rounded-full border border-slate-800 text-slate-300"><i data-lucide="tag" class="w-3 h-3"></i> ${t.categoria}</span></td>
        <td class="py-3 px-4 text-[11px] text-slate-400 font-medium">${t.metodo}</td>
        <td class="py-3 px-4 text-right font-black ${isIngreso ? 'text-emerald-400' : 'text-rose-400'}">
          ${isIngreso ? '+' : '-'}$${Number(t.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </td>
        <td class="py-3 px-4 text-center">
          <button data-action="delete-tx" data-id="${t.id}" class="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-colors flex mx-auto">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('[data-action="delete-tx"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        deleteCallback(e.currentTarget.dataset.id);
      });
    });

    if (this.lucide) this.lucide.createIcons();
  }

  switchTab(tabId) {
    const tabs = ['tab-dashboard', 'tab-semanal', 'tab-deudas', 'tab-movimientos', 'tab-ajustes'];
    tabs.forEach(t => {
      const el = document.getElementById(t);
      const btn = document.getElementById('btn-' + t);
      if (t === tabId) {
        el.classList.remove('hidden');
        el.classList.add('animate-fade-in');
        if (btn) {
          btn.className = "tab-btn px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 bg-gradient-to-r from-emerald-600/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner";
        }
      } else {
        el.classList.add('hidden');
        el.classList.remove('animate-fade-in');
        if (btn) {
          btn.className = "tab-btn px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent";
        }
      }
    });
    if (this.lucide) this.lucide.createIcons();
  }

  openModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('hidden');
    modal.classList.add('flex', 'animate-fade-in-fast');
    if (id === 'modal-transaccion') {
      document.getElementById('txFecha').value = new Date().toISOString().split('T')[0];
    }
  }

  closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('flex', 'animate-fade-in-fast');
    modal.classList.add('hidden');
  }

  launchConfetti() {
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#059669', '#fcd34d', '#3b82f6']
      });
    }
  }
}
