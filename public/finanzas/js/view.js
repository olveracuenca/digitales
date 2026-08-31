class View {
  constructor() {
    this.chartPresupuestoInstance = null;
    this.chartProyeccionInstance = null;
    this.lucide = window.lucide;
  }

  isTxAffectingAccount(t, appState) {
    if (!t) return false;
    if (t.afectaCuenta !== undefined && t.afectaCuenta !== null) {
      return Boolean(t.afectaCuenta);
    }
    const metodo = (t.metodo || '').toLowerCase();
    const concepto = (t.concepto || '').toLowerCase();
    const categoria = (t.categoria || '').toLowerCase();

    if (categoria === 'tarjeta de crédito' || categoria === 'tarjeta de credito') {
      return false;
    }

    if (metodo.includes('crédito') || metodo.includes('credito')) {
      const isPago = concepto.startsWith('pago') || concepto.includes('abono') || categoria === 'deuda';
      if (t.tipo === 'GASTO' && !isPago) return false;
    }

    if (t.cajitaId) {
      const cajita = (appState?.cajitas || []).find(c => c.id === t.cajitaId);
      if (cajita && (cajita.tipoCajita === 'CREDITO' || cajita.isCredito)) {
        const isPago = concepto.startsWith('pago') || concepto.includes('abono') || categoria === 'deuda';
        if (t.tipo === 'GASTO' && !isPago) return false;
      }
    }

    return true;
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
      document.getElementById('heroVencimientosTexto').innerHTML = `Sin vencimientos programados esta semana. Mantén tu flujo en orden.`;
    }

    // Calculations for KPIs
    const sueldo = Number(appState.sueldoMensual) || 20000;
    const totalFixedMonthly = (appState.fixedExpenses || []).reduce((a, f) => a + Number(f.monto), 0);
    const totalDebtsMonthly = (appState.debts || []).filter(d => d.restante > 0).reduce((a, d) => a + Number(d.mensual), 0);
    const totalCommitted = totalFixedMonthly + totalDebtsMonthly;
    const disponible = Math.max(0, sueldo - totalCommitted);
    const pctCommitted = sueldo > 0 ? ((totalCommitted / sueldo) * 100).toFixed(1) : '0';

    const kpiSueldo = document.getElementById('kpiSueldo');
    if (kpiSueldo) kpiSueldo.innerText = `$${sueldo.toLocaleString()}`;

    const kpiSueldoSub = document.getElementById('kpiSueldoSubtitle');
    if (kpiSueldoSub) kpiSueldoSub.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> $${(sueldo / 2).toLocaleString()} quincenal`;

    const kpiFijos = document.getElementById('kpiFijos');
    if (kpiFijos) kpiFijos.innerText = `$${totalCommitted.toLocaleString()}`;

    const kpiFijosSub = document.getElementById('kpiFijosSubtitle');
    if (kpiFijosSub) kpiFijosSub.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> ${pctCommitted}% comprometido`;

    const kpiDisp = document.getElementById('kpiDisponible');
    if (kpiDisp) kpiDisp.innerText = `$${disponible.toLocaleString()}`;

    const totalDeuda = (appState.debts || []).reduce((acc, d) => acc + (d.restante > 0 ? Number(d.restante) : 0), 0);
    const kpiDeuda = document.getElementById('kpiDeudaTotal');
    if (kpiDeuda) kpiDeuda.innerText = `$${totalDeuda.toLocaleString()}`;

    // Calculate next debt payoff milestone
    const activeDebts = (appState.debts || []).filter(d => d.restante > 0 && d.mensual > 0);
    const kpiProximoHito = document.getElementById('kpiProximoHito');
    if (kpiProximoHito) {
      if (activeDebts.length > 0) {
        activeDebts.sort((a, b) => (a.restante / a.mensual) - (b.restante / b.mensual));
        const nextDebt = activeDebts[0];
        const monthsToPay = Math.ceil(nextDebt.restante / nextDebt.mensual);
        const targetDate = new Date(START_DATE);
        targetDate.setMonth(targetDate.getMonth() + monthsToPay);
        const mName = MONTH_NAMES[targetDate.getMonth()].slice(0, 3);
        const yShort = String(targetDate.getFullYear()).slice(2);
        kpiProximoHito.innerText = `Próx: ${nextDebt.nombre} (${mName} '${yShort})`;
      } else {
        kpiProximoHito.innerText = `¡Sin deudas activas! 🎉`;
      }
    }

    // Only expenses affecting the main checking/cash account reduce cash spent
    const weekTx = (appState.transactions || []).filter(t => Number(t.semanaNum) === currWeek.num && t.tipo === 'GASTO');
    const realSpentCash = weekTx.filter(t => this.isTxAffectingAccount(t, appState)).reduce((acc, t) => acc + Number(t.monto), 0);
    const realSpentCredit = weekTx.filter(t => !this.isTxAffectingAccount(t, appState)).reduce((acc, t) => acc + Number(t.monto), 0);

    const heroGastoReal = document.getElementById('heroGastoReal');
    if (heroGastoReal) {
      heroGastoReal.innerHTML = `$${realSpentCash.toLocaleString('es-MX', { minimumFractionDigits: 2 })}${realSpentCredit > 0 ? ` <span class="text-[10px] text-purple-400 font-bold block sm:inline">(+$${realSpentCredit.toLocaleString()} en tarjeta)</span>` : ''}`;
    }
    
    // Compute cumulative rolling balance up to current week (only counting cash in/out of main account)
    let rollingBalance = 0;
    for (let i = 0; i <= currIdx; i++) {
        const w = weeks[i];
        const wTxs = (appState.transactions || []).filter(t => Number(t.semanaNum) === w.num);
        const wGastado = wTxs.filter(t => t.tipo === 'GASTO' && this.isTxAffectingAccount(t, appState)).reduce((a, b) => a + Number(b.monto), 0);
        const wIngresos = w.baseIncome + wTxs.filter(t => t.tipo === 'INGRESO' && this.isTxAffectingAccount(t, appState)).reduce((a, b) => a + Number(b.monto), 0);
        rollingBalance += (wIngresos - wGastado);
    }

    const heroRem = document.getElementById('heroRemanente');
    if (heroRem) {
      heroRem.innerText = `$${rollingBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
      heroRem.className = `text-2xl md:text-3xl font-black tracking-tight drop-shadow-md ${rollingBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
    }

    // Render Dynamic Milestones
    this.renderMilestones(appState);
  }

  renderMilestones(appState) {
    const container = document.getElementById('milestonesContainer');
    if (!container) return;
    container.innerHTML = '';

    const debts = (appState.debts || []).map(d => {
      const isLiq = d.restante <= 0;
      const months = d.mensual > 0 ? Math.ceil(d.restante / d.mensual) : 0;
      return {
        ...d,
        isLiq,
        months
      };
    }).sort((a, b) => a.months - b.months);

    const colors = ['amber', 'teal', 'indigo', 'rose', 'sky', 'emerald'];
    let totalLiberado = 0;

    const cardsToShow = debts.slice(0, 3);
    cardsToShow.forEach((d, idx) => {
      totalLiberado += Number(d.mensual);
      const color = colors[idx % colors.length];

      const targetDate = new Date(START_DATE);
      targetDate.setMonth(targetDate.getMonth() + d.months);
      const mName = MONTH_NAMES[targetDate.getMonth()];
      const yFull = targetDate.getFullYear();

      const colorBorders = {
        amber: 'bg-amber-500',
        teal: 'bg-teal-500',
        indigo: 'bg-indigo-500',
        rose: 'bg-rose-500',
        sky: 'bg-sky-500',
        emerald: 'bg-emerald-500'
      };

      const card = document.createElement('div');
      card.className = "bg-slate-900 p-4 rounded-xl border border-slate-800/80 relative overflow-hidden group";
      card.innerHTML = `
        <div class="absolute top-0 left-0 w-1 h-full ${colorBorders[color]}"></div>
        <div class="flex justify-between items-start">
          <div>
            <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">${idx + 1}. ${d.nombre}</p>
            <p class="text-sm font-black text-white mt-1">${d.isLiq ? '¡Liquidada! 🎉' : `${mName} ${yFull}`}</p>
            <p class="text-xs text-${color}-400 font-bold mt-2">+${Number(d.mensual).toLocaleString()} / mes</p>
          </div>
          <span class="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-bold">${d.isLiq ? 'Completado' : `En ${d.months}m`}</span>
        </div>
      `;
      container.appendChild(card);
    });

    // 4th Card: Total Liberado
    const allDebtsMonthly = (appState.debts || []).reduce((acc, d) => acc + Number(d.mensual), 0);
    const summaryCard = document.createElement('div');
    summaryCard.className = "bg-gradient-to-br from-emerald-900/60 to-slate-900 p-4 rounded-xl border border-emerald-500/40 relative overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)]";
    summaryCard.innerHTML = `
      <div class="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
      <div class="flex justify-between items-start">
        <div>
          <p class="text-[11px] text-emerald-300/80 font-bold uppercase tracking-wider">Flujo Total a Liberar</p>
          <p class="text-sm font-medium text-slate-200 mt-1">Al liquidar tus compromisos</p>
          <p class="text-lg font-black text-emerald-400 mt-1">+$${allDebtsMonthly.toLocaleString()} / mes</p>
        </div>
        <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <i data-lucide="check-check" class="w-4 h-4 text-emerald-400"></i>
        </div>
      </div>
    `;
    container.appendChild(summaryCard);

    if (this.lucide) this.lucide.createIcons();
  }

  renderCharts(appState) {
    const sueldo = Number(appState.sueldoMensual) || 20000;
    const totalFixed = (appState.fixedExpenses || []).reduce((a, f) => a + Number(f.monto), 0);
    const totalDebtsMonthly = (appState.debts || []).filter(d => d.restante > 0).reduce((a, d) => a + Number(d.mensual), 0);
    const totalCommitted = totalFixed + totalDebtsMonthly;

    const badge = document.getElementById('chartPresupuestoBadge');
    if (badge) badge.innerText = `$${sueldo.toLocaleString()} Base`;

    // 1. Donut Chart
    const ctx1 = document.getElementById('chartPresupuesto').getContext('2d');
    if (this.chartPresupuestoInstance) this.chartPresupuestoInstance.destroy();

    this.chartPresupuestoInstance = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Gastos Fijos & Deudas', 'Ahorro / Metas', 'Gustos & Ocio', 'Fondo Imprevistos'],
        datasets: [{
          data: [totalCommitted, appState.ahorroMeta || 2000, appState.gustosMeta || 1500, appState.imprevistosMeta || 1050],
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

    // 2. Line Chart (Dynamic projection calculation)
    const ctx2 = document.getElementById('chartProyeccion').getContext('2d');
    if (this.chartProyeccionInstance) this.chartProyeccionInstance.destroy();

    const labels = [];
    const deudaData = [];
    const ahorroData = [];

    const simDebts = (appState.debts || []).map(d => ({ restante: Number(d.restante), mensual: Number(d.mensual) }));
    const metaAhorro = Number(appState.ahorroMeta) || 2000;
    let accumulatedSavings = 0;

    for (let m = 0; m < 16; m++) {
      const dObj = new Date(START_DATE);
      dObj.setMonth(dObj.getMonth() + m);
      labels.push(MONTH_NAMES[dObj.getMonth()].slice(0, 3));

      // Calculate sum of remaining debts at month m
      const currentDeudaSum = simDebts.reduce((sum, d) => sum + Math.max(0, d.restante), 0);
      deudaData.push(currentDeudaSum);

      accumulatedSavings += metaAhorro;
      ahorroData.push(accumulatedSavings);

      // Advance one month for simulation
      simDebts.forEach(d => {
        if (d.restante > 0) {
          d.restante = Math.max(0, d.restante - d.mensual);
        }
      });
    }

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

      const weekTxs = (appState.transactions || []).filter(t => Number(t.semanaNum) === w.num);
      const totalGastadoCuenta = weekTxs.filter(t => t.tipo === 'GASTO' && this.isTxAffectingAccount(t, appState)).reduce((a, b) => a + Number(b.monto), 0);
      const totalGastadoCredito = weekTxs.filter(t => t.tipo === 'GASTO' && !this.isTxAffectingAccount(t, appState)).reduce((a, b) => a + Number(b.monto), 0);
      const totalIngresos = w.baseIncome + weekTxs.filter(t => t.tipo === 'INGRESO' && this.isTxAffectingAccount(t, appState)).reduce((a, b) => a + Number(b.monto), 0);
      const balance = totalIngresos - totalGastadoCuenta;

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
                        <p class="text-xs ${isPaid ? 'text-emerald-400/80' : 'text-slate-400'} font-medium">$${Number(item.monto).toLocaleString()} MXN</p>
                      </div>
                    </div>
                    <button data-action="toggle-payment" data-key="${itemPaidKey}" data-name="${item.name}" data-monto="${item.monto}" data-sem="${w.num}" data-debt="${item.debtId || ''}" data-cat="${item.categoria || (item.debtId ? 'Deuda' : 'Servicios Hogar')}"
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
            <div class="flex gap-3 sm:gap-4 text-xs font-medium mr-1 sm:mr-2">
              <div class="flex flex-col">
                <span class="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Ingresos</span>
                <span class="text-emerald-400/90 font-bold">$${totalIngresos.toLocaleString()}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Gastos Cta</span>
                <span class="text-rose-400/90 font-bold">$${totalGastadoCuenta.toLocaleString()}</span>
              </div>
              ${totalGastadoCredito > 0 ? `
                <div class="flex flex-col">
                  <span class="text-[10px] text-purple-400 uppercase tracking-wider mb-0.5">💳 Tarjeta</span>
                  <span class="text-purple-300 font-bold">$${totalGastadoCredito.toLocaleString()}</span>
                </div>
              ` : ''}
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
          t.dataset.debt,
          t.dataset.cat
        );
      });
    });

    if (this.lucide) this.lucide.createIcons();
  }

  renderDebts(debts, callbacks) {
    const container = document.getElementById('debtsContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!debts || debts.length === 0) {
      container.innerHTML = `
        <div class="col-span-2 text-center p-8 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p class="text-sm font-bold text-white">No tienes deudas registradas</p>
          <p class="text-xs text-slate-400 mt-1">Usa el botón "+ Nueva Deuda" para agregar compromisos financieros.</p>
        </div>
      `;
      return;
    }

    debts.forEach(d => {
      const isLiquidada = d.isLiquidada || d.restante <= 0;
      const progressPct = d.progresoPct !== undefined ? d.progresoPct : (d.inicial > 0 ? Math.min(100, Math.round(((d.inicial - d.restante) / d.inicial) * 100)) : 100);
      const pagado = d.pagado !== undefined ? d.pagado : Math.max(0, d.inicial - d.restante);

      const colorStyles = {
        rose: { iconBg: 'bg-rose-500/20', iconText: 'text-rose-400', barGrad: 'from-rose-600 to-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
        amber: { iconBg: 'bg-amber-500/20', iconText: 'text-amber-400', barGrad: 'from-amber-600 to-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
        teal: { iconBg: 'bg-teal-500/20', iconText: 'text-teal-400', barGrad: 'from-teal-600 to-teal-400', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
        indigo: { iconBg: 'bg-indigo-500/20', iconText: 'text-indigo-400', barGrad: 'from-indigo-600 to-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
        emerald: { iconBg: 'bg-emerald-500/20', iconText: 'text-emerald-400', barGrad: 'from-emerald-600 to-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
        sky: { iconBg: 'bg-sky-500/20', iconText: 'text-sky-400', barGrad: 'from-sky-600 to-sky-400', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
        purple: { iconBg: 'bg-purple-500/20', iconText: 'text-purple-400', barGrad: 'from-purple-600 to-purple-400', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }
      };

      const style = colorStyles[d.color] || colorStyles.indigo;

      const card = document.createElement('div');
      card.className = `p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
        isLiquidada 
          ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.08)]' 
          : 'bg-slate-900/60 backdrop-blur-md border-slate-800 hover:border-slate-700'
      }`;

      card.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center ${isLiquidada ? 'bg-emerald-500/20' : style.iconBg}">
              <i data-lucide="${isLiquidada ? 'party-popper' : 'credit-card'}" class="w-5 h-5 ${isLiquidada ? 'text-emerald-400' : style.iconText}"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-base font-black text-white">${d.nombre}</h4>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase ${
                  isLiquidada ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : style.badge
                }">${isLiquidada ? 'Liquidada' : 'Activa'}</span>
              </div>
              <p class="text-xs text-slate-400 font-medium mt-0.5">${d.acreedor} • Corte: ${d.quincena} (Día ${d.dia})</p>
            </div>
          </div>
          
          <div class="flex items-center gap-1.5">
            <button data-action="edit-debt" data-id="${d.id}" title="Editar deuda" class="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button data-action="delete-debt" data-id="${d.id}" title="Eliminar deuda" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- 3 Summary Metrics: Inicial, Abonado, Restante -->
        <div class="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-center">
          <div>
            <p class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Monto Inicial</p>
            <p class="text-xs sm:text-sm font-black text-slate-300 mt-0.5">$${Number(d.inicial).toLocaleString()}</p>
          </div>
          <div class="border-x border-slate-800">
            <p class="text-[9px] text-emerald-500 uppercase font-bold tracking-wider">Abonado</p>
            <p class="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">$${Number(pagado).toLocaleString()}</p>
          </div>
          <div>
            <p class="text-[9px] text-rose-500 uppercase font-bold tracking-wider">Restante</p>
            <p class="text-xs sm:text-sm font-black text-white mt-0.5">$${Number(d.restante).toLocaleString()}</p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="flex justify-between text-xs font-bold mb-1.5">
            <span class="text-slate-400 text-[11px]">${d.mensual > 0 ? `$${Number(d.mensual).toLocaleString()} / mes` : ''} • Fin: <span class="text-slate-200">${d.fin}</span></span>
            <span class="${isLiquidada ? 'text-emerald-400' : 'text-indigo-400'} font-black">${progressPct}% Pagado</span>
          </div>
          <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
            <div class="h-full bg-gradient-to-r ${isLiquidada ? 'from-emerald-600 to-emerald-400' : 'from-indigo-600 to-emerald-400'} rounded-full transition-all duration-700" style="width: ${progressPct}%"></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
          ${!isLiquidada ? `
            <button data-action="quick-pay" data-id="${d.id}" class="flex-1 text-xs font-black py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-900/30 active:scale-95 flex items-center justify-center gap-1.5">
              <i data-lucide="zap" class="w-3.5 h-3.5 stroke-[3]"></i> Abono Rápido ($${Number(d.mensual).toLocaleString()})
            </button>
            <button data-action="custom-abono" data-id="${d.id}" class="text-xs font-bold py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700 active:scale-95 flex items-center justify-center gap-1.5">
              <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Abonar
            </button>
          ` : `
            <span class="text-xs font-black text-emerald-400 flex items-center gap-1.5 py-1">
              <i data-lucide="check-check" class="w-4 h-4"></i> Deuda totalmente saldada
            </span>
          `}
        </div>
      `;
      container.appendChild(card);
    });

    // Attach event handlers
    if (callbacks) {
      if (callbacks.onQuickPay) {
        document.querySelectorAll('[data-action="quick-pay"]').forEach(btn => {
          btn.addEventListener('click', (e) => callbacks.onQuickPay(e.currentTarget.dataset.id));
        });
      }
      if (callbacks.onCustomAbono) {
        document.querySelectorAll('[data-action="custom-abono"]').forEach(btn => {
          btn.addEventListener('click', (e) => callbacks.onCustomAbono(e.currentTarget.dataset.id));
        });
      }
      if (callbacks.onEditDebt) {
        document.querySelectorAll('[data-action="edit-debt"]').forEach(btn => {
          btn.addEventListener('click', (e) => callbacks.onEditDebt(e.currentTarget.dataset.id));
        });
      }
      if (callbacks.onDeleteDebt) {
        document.querySelectorAll('[data-action="delete-debt"]').forEach(btn => {
          btn.addEventListener('click', (e) => callbacks.onDeleteDebt(e.currentTarget.dataset.id));
        });
      }
    }

    if (this.lucide) this.lucide.createIcons();
  }

  renderFixedExpenses(fixedExpenses, callbacks) {
    const container = document.getElementById('fixedExpensesContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!fixedExpenses || fixedExpenses.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center p-8 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p class="text-sm font-bold text-white">No tienes gastos fijos registrados</p>
          <p class="text-xs text-slate-400 mt-1">Usa el botón "+ Nuevo Fijo" para registrar tus compromisos recurrentes.</p>
        </div>
      `;
      return;
    }

    fixedExpenses.forEach(f => {
      const card = document.createElement('div');
      card.className = "bg-slate-900/60 backdrop-blur p-4 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between group";
      card.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
            <i data-lucide="receipt-text" class="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors"></i>
          </div>
          <div>
            <p class="text-sm font-bold text-white leading-tight">${f.concepto}</p>
            <p class="text-[11px] text-slate-400 font-medium mt-0.5">${f.categoria} • Día ${f.dia}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-right">
            <p class="text-sm font-black text-emerald-400">$${Number(f.monto).toLocaleString()}</p>
            <span class="text-[9px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800/50 uppercase tracking-wider font-bold">${f.quincena === 'Quincena 1' ? 'Q1' : 'Q2'}</span>
          </div>
          <div class="flex flex-col gap-1 ml-2">
            <button data-action="edit-fixed" data-id="${f.id}" title="Editar gasto fijo" class="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button data-action="delete-fixed" data-id="${f.id}" title="Eliminar gasto fijo" class="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    if (callbacks) {
      if (callbacks.onEditFixed) {
        document.querySelectorAll('[data-action="edit-fixed"]').forEach(btn => {
          btn.addEventListener('click', (e) => callbacks.onEditFixed(e.currentTarget.dataset.id));
        });
      }
      if (callbacks.onDeleteFixed) {
        document.querySelectorAll('[data-action="delete-fixed"]').forEach(btn => {
          btn.addEventListener('click', (e) => callbacks.onDeleteFixed(e.currentTarget.dataset.id));
        });
      }
    }

    if (this.lucide) this.lucide.createIcons();
  }

  renderTransactions(appState, deleteCallback) {
    const tbody = document.getElementById('transactionsTableBody');
    const noMsg = document.getElementById('noTransactionsMsg');
    const catFilter = document.getElementById('filterCategory')?.value || 'ALL';

    if (!tbody) return;
    tbody.innerHTML = '';
    const filtered = (appState.transactions || []).filter(t => catFilter === 'ALL' || t.categoria === catFilter);

    if (filtered.length === 0) {
      if (noMsg) noMsg.classList.remove('hidden');
      return;
    } else {
      if (noMsg) noMsg.classList.add('hidden');
    }

    filtered.forEach(t => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-800/40 transition-colors border-b border-slate-800/50 last:border-0";
      const isIngreso = t.tipo === 'INGRESO';
      const isDeuda = t.categoria === 'Deuda';
      const isTarjetaCat = t.categoria === 'Tarjeta de Crédito';
      const isCard = t.metodo && t.metodo.toLowerCase().includes('crédito');
      const affectsAccount = this.isTxAffectingAccount(t, appState);

      let catBadge = `<span class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 bg-slate-900 rounded-full border border-slate-800 text-slate-300"><i data-lucide="tag" class="w-3 h-3"></i> ${t.categoria}</span>`;
      if (isDeuda) {
        catBadge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30 text-indigo-300"><i data-lucide="credit-card" class="w-3 h-3 text-indigo-400"></i> ${t.categoria}</span>`;
      } else if (isTarjetaCat) {
        catBadge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300"><i data-lucide="credit-card" class="w-3 h-3 text-purple-400"></i> ${t.categoria}</span>`;
      }

      let metodoBadge = `<span class="text-[11px] text-slate-400 font-medium whitespace-nowrap">${t.metodo}</span>`;
      if (isCard) {
        metodoBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-purple-500/20 rounded-md border border-purple-500/30 text-purple-300"><i data-lucide="credit-card" class="w-3 h-3"></i> ${t.metodo}</span>`;
      }

      const isPago = t.concepto && (t.concepto.toLowerCase().startsWith('pago') || t.concepto.toLowerCase().includes('abono') || t.categoria === 'Deuda');

      let montoHtml = '';
      if (isIngreso) {
        montoHtml = `<span class="text-emerald-400 font-black">+$${Number(t.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>`;
      } else if (!affectsAccount) {
        const badgeLabel = isPago ? '💳 Pago Tarjeta (No resta balance)' : '💳 Cargo Tarjeta (No resta balance)';
        montoHtml = `
          <div class="flex flex-col items-end">
            <span class="text-purple-300 font-black">-$${Number(t.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            <span class="text-[9px] text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">${badgeLabel}</span>
          </div>
        `;
      } else if (isPago) {
        montoHtml = `
          <div class="flex flex-col items-end">
            <span class="text-rose-400 font-black">-$${Number(t.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            <span class="text-[9px] text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">💸 Pago (Descuenta balance)</span>
          </div>
        `;
      } else {
        montoHtml = `<span class="text-rose-400 font-black">-$${Number(t.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>`;
      }

      tr.innerHTML = `
        <td class="py-3 px-4 text-xs text-slate-400 font-medium whitespace-nowrap">${t.fecha}</td>
        <td class="py-3 px-4 whitespace-nowrap"><span class="bg-slate-900 border border-slate-700 text-slate-300 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">Sem ${t.semanaNum}</span></td>
        <td class="py-3 px-4 font-bold text-white">${t.concepto}</td>
        <td class="py-3 px-4 whitespace-nowrap">${catBadge}</td>
        <td class="py-3 px-4 whitespace-nowrap">${metodoBadge}</td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          ${montoHtml}
        </td>
        <td class="py-3 px-4 text-center">
          <button data-action="delete-tx" data-id="${t.id}" title="Eliminar movimiento de la bitácora" class="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-colors flex mx-auto">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (deleteCallback) {
      document.querySelectorAll('[data-action="delete-tx"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          deleteCallback(e.currentTarget.dataset.id);
        });
      });
    }

    if (this.lucide) this.lucide.createIcons();
  }

  updateDebtSelectOptions(debts) {
    const selects = ['abonoDebtId', 'txDebtId'];
    selects.forEach(selId => {
      const el = document.getElementById(selId);
      if (el) {
        const currVal = el.value;
        el.innerHTML = (debts || []).map(d => 
          `<option value="${d.id}">${d.nombre} (Saldo: $${Number(d.restante).toLocaleString()} - Abono: $${Number(d.mensual).toLocaleString()})</option>`
        ).join('');
        if (currVal && debts.some(d => d.id === currVal)) {
          el.value = currVal;
        }
      }
    });
  }

  renderCajitasSection(cajitas, summary, movements, callbacks) {
    const totalEl = document.getElementById('kpiTotalCajitas');
    if (totalEl) totalEl.innerText = `$${(summary.totalAhorro || summary.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

    const deudaTarjetasEl = document.getElementById('kpiDeudaTarjetasCajitas');
    if (deudaTarjetasEl) deudaTarjetasEl.innerText = `$${(summary.totalDeudaTarjetas || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

    const netoEl = document.getElementById('kpiNetoCajitas');
    if (netoEl) {
      const neto = summary.saldoNeto !== undefined ? summary.saldoNeto : (summary.totalAhorro || 0) - (summary.totalDeudaTarjetas || 0);
      netoEl.innerText = `$${neto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
      netoEl.className = `text-2xl md:text-3xl font-black tracking-tight drop-shadow-md ${neto >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
    }

    const mioEl = document.getElementById('kpiMioCajitas');
    if (mioEl) mioEl.innerText = `$${(summary.mio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

    const esposaEl = document.getElementById('kpiEsposaCajitas');
    if (esposaEl) esposaEl.innerText = `$${(summary.esposa || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

    const compEl = document.getElementById('kpiCompartidoCajitas');
    if (compEl) compEl.innerText = `$${(summary.compartido || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

    const countBadge = document.getElementById('badgeCajitasCount');
    if (countBadge) countBadge.innerText = `${cajitas.length} ${cajitas.length === 1 ? 'Cajita/Tarjeta' : 'Cajitas/Tarjetas'}`;

    this.updateCajitasSelectOptions(cajitas);

    const container = document.getElementById('cajitasContainer');
    const noMsg = document.getElementById('noCajitasMsg');
    if (container) {
      container.innerHTML = '';
      if (cajitas.length === 0) {
        if (noMsg) noMsg.classList.remove('hidden');
      } else {
        if (noMsg) noMsg.classList.add('hidden');

        cajitas.forEach(c => {
          const card = document.createElement('div');
          const isCredito = c.isCredito || c.tipoCajita === 'CREDITO';
          
          const colorStyles = {
            purple: { border: 'border-purple-500/30', bgGlow: 'bg-purple-500/10', iconBg: 'bg-purple-500/20', iconText: 'text-purple-400', barGrad: 'from-purple-600 to-purple-400', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
            indigo: { border: 'border-indigo-500/30', bgGlow: 'bg-indigo-500/10', iconBg: 'bg-indigo-500/20', iconText: 'text-indigo-400', barGrad: 'from-indigo-600 to-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
            rose: { border: 'border-rose-500/30', bgGlow: 'bg-rose-500/10', iconBg: 'bg-rose-500/20', iconText: 'text-rose-400', barGrad: 'from-rose-600 to-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
            emerald: { border: 'border-emerald-500/30', bgGlow: 'bg-emerald-500/10', iconBg: 'bg-emerald-500/20', iconText: 'text-emerald-400', barGrad: 'from-emerald-600 to-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            amber: { border: 'border-amber-500/30', bgGlow: 'bg-amber-500/10', iconBg: 'bg-amber-500/20', iconText: 'text-amber-400', barGrad: 'from-amber-600 to-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
            sky: { border: 'border-sky-500/30', bgGlow: 'bg-sky-500/10', iconBg: 'bg-sky-500/20', iconText: 'text-sky-400', barGrad: 'from-sky-600 to-sky-400', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
            teal: { border: 'border-teal-500/30', bgGlow: 'bg-teal-500/10', iconBg: 'bg-teal-500/20', iconText: 'text-teal-400', barGrad: 'from-teal-600 to-teal-400', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30' }
          };

          const style = colorStyles[c.color] || (isCredito ? colorStyles.purple : colorStyles.indigo);
          const hasMeta = !isCredito && Number(c.meta) > 0;
          const progressPct = hasMeta ? Math.min(100, Math.round((c.saldo / c.meta) * 100)) : 0;
          const isMetaReached = hasMeta && c.saldo >= c.meta;

          let ownerIcon = 'user';
          if (c.asignado === 'Esposa') ownerIcon = 'heart';
          if (c.asignado === 'Compartido') ownerIcon = 'users';

          card.className = `glass rounded-2xl p-5 md:p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:${style.border} flex flex-col justify-between group ${isCredito ? 'border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-slate-900/90' : ''}`;
          
          card.innerHTML = `
            <div class="absolute -right-8 -top-8 w-32 h-32 ${style.bgGlow} rounded-full blur-2xl group-hover:scale-125 transition-transform pointer-events-none"></div>
            
            <div>
              <div class="flex items-start justify-between gap-3 relative z-10">
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-2xl ${style.iconBg} flex items-center justify-center border border-white/10 shadow-inner">
                    <i data-lucide="${isCredito ? 'credit-card' : (c.icono || 'boxes')}" class="w-5 h-5 ${style.iconText}"></i>
                  </div>
                  <div>
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <h4 class="text-base font-black text-white leading-tight">${c.nombre}</h4>
                      <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${isCredito ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'}">
                        ${isCredito ? 'Tarjeta Crédito' : 'Ahorro'}
                      </span>
                    </div>
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${style.badge}">
                      <i data-lucide="${ownerIcon}" class="w-3 h-3"></i> ${c.asignado}
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-1.5">
                  <button data-action="cajita-edit" data-id="${c.id}" title="Editar cajita / tarjeta" class="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold flex items-center gap-1.5 transition">
                    <i data-lucide="edit-3" class="w-3.5 h-3.5 text-emerald-400"></i>
                    <span class="hidden sm:inline">Editar</span>
                  </button>
                  <button data-action="cajita-delete" data-id="${c.id}" title="Eliminar" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

              <!-- Saldo / Deuda Section -->
              <div class="mt-5 relative z-10">
                <p class="text-[10px] uppercase font-bold tracking-wider ${isCredito ? 'text-purple-400' : 'text-slate-400'}">
                  ${isCredito ? 'Deuda / Saldo Por Pagar' : 'Saldo Disponible'}
                </p>
                <div class="flex items-baseline gap-2 mt-0.5">
                  <h3 class="text-2xl md:text-3xl font-black tracking-tight ${isCredito ? (c.saldo > 0 ? 'text-purple-300' : 'text-emerald-400') : 'text-white'}">
                    $${Number(c.saldo).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </h3>
                  <span class="text-[10px] text-slate-400 font-medium">MXN</span>
                </div>
                ${c.descripcion ? `<p class="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">${c.descripcion}</p>` : ''}
              </div>

              <!-- Credit Card specific metrics -->
              ${isCredito ? `
                <div class="mt-4 pt-3 border-t border-slate-800/60 relative z-10 text-xs font-medium space-y-1.5">
                  ${c.limiteCredito > 0 ? `
                    <div class="flex justify-between items-center text-[11px] font-bold">
                      <span class="text-slate-400">Límite: <strong class="text-white">$${Number(c.limiteCredito).toLocaleString()}</strong></span>
                      <span class="text-emerald-400 font-black">Disp: $${Number(c.disponible).toLocaleString()}</span>
                    </div>
                    <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                      <div class="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full transition-all duration-700" style="width: ${c.usoPct}%"></div>
                    </div>
                  ` : ''}
                  ${(c.diaCorte || c.diaPago) ? `
                    <div class="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-1">
                      <span>Corte: Día ${c.diaCorte || 1}</span>
                      <span>Límite Pago: Día ${c.diaPago || 15}</span>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <!-- Savings Meta Progress Bar -->
              ${hasMeta ? `
                <div class="mt-4 pt-3 border-t border-slate-800/60 relative z-10">
                  <div class="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span class="text-slate-400 text-[11px] flex items-center gap-1">
                      <i data-lucide="target" class="w-3.5 h-3.5 text-slate-400"></i> Meta: $${Number(c.meta).toLocaleString()}
                    </span>
                    <span class="text-xs font-black ${isMetaReached ? 'text-emerald-400' : style.iconText}">
                      ${progressPct}% ${isMetaReached ? '🎉' : ''}
                    </span>
                  </div>
                  <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                    <div class="h-full bg-gradient-to-r ${style.barGrad} rounded-full transition-all duration-700" style="width: ${progressPct}%"></div>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Action Buttons based on type -->
            <div class="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 relative z-10">
              ${isCredito ? `
                <button data-action="cajita-cargo" data-id="${c.id}" class="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-900/30 active:scale-95">
                  <i data-lucide="shopping-cart" class="w-3.5 h-3.5 stroke-[2.5]"></i> + Cargo / Compra
                </button>
                <button data-action="cajita-pago" data-id="${c.id}" class="bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-700 active:scale-95">
                  <i data-lucide="check-circle" class="w-3.5 h-3.5 stroke-[2.5]"></i> Pagar Tarjeta
                </button>
              ` : `
                <button data-action="cajita-deposit" data-id="${c.id}" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 active:scale-95">
                  <i data-lucide="plus-circle" class="w-3.5 h-3.5 stroke-[2.5]"></i> Meter Dinero
                </button>
                <button data-action="cajita-withdraw" data-id="${c.id}" class="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-700 active:scale-95">
                  <i data-lucide="minus-circle" class="w-3.5 h-3.5 stroke-[2.5]"></i> Sacar Dinero
                </button>
              `}
            </div>
          `;
          container.appendChild(card);
        });
      }
    }

    this.renderCajitasMovementsTable(movements, callbacks.onDeleteMovement);

    // Event listeners
    if (callbacks.onDeposit) {
      document.querySelectorAll('[data-action="cajita-deposit"]').forEach(b => {
        b.addEventListener('click', (e) => callbacks.onDeposit(e.currentTarget.dataset.id));
      });
    }
    if (callbacks.onWithdraw) {
      document.querySelectorAll('[data-action="cajita-withdraw"]').forEach(b => {
        b.addEventListener('click', (e) => callbacks.onWithdraw(e.currentTarget.dataset.id));
      });
    }
    if (callbacks.onCargo) {
      document.querySelectorAll('[data-action="cajita-cargo"]').forEach(b => {
        b.addEventListener('click', (e) => callbacks.onCargo(e.currentTarget.dataset.id));
      });
    }
    if (callbacks.onPago) {
      document.querySelectorAll('[data-action="cajita-pago"]').forEach(b => {
        b.addEventListener('click', (e) => callbacks.onPago(e.currentTarget.dataset.id));
      });
    }
    if (callbacks.onEditCajita) {
      document.querySelectorAll('[data-action="cajita-edit"]').forEach(b => {
        b.addEventListener('click', (e) => callbacks.onEditCajita(e.currentTarget.dataset.id));
      });
    }
    if (callbacks.onDeleteCajita) {
      document.querySelectorAll('[data-action="cajita-delete"]').forEach(b => {
        b.addEventListener('click', (e) => callbacks.onDeleteCajita(e.currentTarget.dataset.id));
      });
    }

    if (this.lucide) this.lucide.createIcons();
  }

  updateCajitasSelectOptions(cajitas) {
    const selects = ['cmovCajitaId', 'trFromCajitaId', 'trToCajitaId'];
    selects.forEach(selId => {
      const el = document.getElementById(selId);
      if (el) {
        const currVal = el.value;
        el.innerHTML = (cajitas || []).map(c => {
          const isCred = c.isCredito || c.tipoCajita === 'CREDITO';
          const icon = isCred ? '💳' : '👛';
          const lbl = isCred ? `Deuda: $${Number(c.saldo).toLocaleString()}` : `Saldo: $${Number(c.saldo).toLocaleString()}`;
          return `<option value="${c.id}">${icon} ${c.nombre} (${lbl} - ${c.asignado})</option>`;
        }).join('');
        if (currVal && (cajitas || []).some(c => c.id === currVal)) {
          el.value = currVal;
        }
      }
    });

    // Populate #txCajitaId in General Transactions Modal
    const txCajitaSelect = document.getElementById('txCajitaId');
    if (txCajitaSelect) {
      const currVal = txCajitaSelect.value;
      let html = '<option value="">-- Ninguna (Gasto General) --</option>';
      (cajitas || []).forEach(c => {
        const isCred = c.isCredito || c.tipoCajita === 'CREDITO';
        const icon = isCred ? '💳' : '👛';
        const lbl = isCred ? `Deuda actual: $${Number(c.saldo).toLocaleString()}` : `Saldo: $${Number(c.saldo).toLocaleString()}`;
        html += `<option value="${c.id}">${icon} ${c.nombre} (${lbl} - ${c.asignado})</option>`;
      });
      txCajitaSelect.innerHTML = html;
      if (currVal && (cajitas || []).some(c => c.id === currVal)) {
        txCajitaSelect.value = currVal;
      }
    }

    const filterSelect = document.getElementById('filterCajitaSelect');
    if (filterSelect) {
      const currFilter = filterSelect.value;
      let html = '<option value="ALL">Todas las Cajitas</option>';
      (cajitas || []).forEach(c => {
        const isCred = c.isCredito || c.tipoCajita === 'CREDITO';
        const icon = isCred ? '💳' : '👛';
        html += `<option value="${c.id}">${icon} ${c.nombre} (${c.asignado})</option>`;
      });
      filterSelect.innerHTML = html;
      if (currFilter && (currFilter === 'ALL' || (cajitas || []).some(c => c.id === currFilter))) {
        filterSelect.value = currFilter;
      }
    }
  }

  renderCajitasMovementsTable(movements, deleteCallback) {
    const tbody = document.getElementById('cajitasMovementsTableBody');
    const noMsg = document.getElementById('noCajitaMovementsMsg');
    const filterCajita = document.getElementById('filterCajitaSelect')?.value || 'ALL';
    const filterTipo = document.getElementById('filterCajitaTipo')?.value || 'ALL';

    if (!tbody) return;
    tbody.innerHTML = '';

    let filtered = movements || [];
    if (filterCajita !== 'ALL') {
      filtered = filtered.filter(m => m.cajitaId === filterCajita);
    }
    if (filterTipo !== 'ALL') {
      filtered = filtered.filter(m => m.tipo === filterTipo);
    }

    if (filtered.length === 0) {
      if (noMsg) noMsg.classList.remove('hidden');
      return;
    } else {
      if (noMsg) noMsg.classList.add('hidden');
    }

    filtered.forEach(m => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-800/40 transition-colors border-b border-slate-800/50 last:border-0";
      
      const isIngreso = m.tipo === 'INGRESO' || m.tipo === 'CARGO';
      const isCargoTarjeta = m.tipo === 'CARGO';
      const isPagoTarjeta = m.tipo === 'PAGO';
      const isRetiro = m.tipo === 'EGRESO';

      let tipoBadge = '';
      if (isCargoTarjeta) {
        tipoBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-purple-500/20 text-purple-300 border-purple-500/30"><i data-lucide="credit-card" class="w-3 h-3"></i> Compra Tarjeta (+)</span>`;
      } else if (isPagoTarjeta) {
        tipoBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/30"><i data-lucide="check-circle" class="w-3 h-3"></i> Pago Tarjeta (-)</span>`;
      } else if (isRetiro) {
        tipoBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-rose-500/20 text-rose-300 border-rose-500/30"><i data-lucide="arrow-up-right" class="w-3 h-3"></i> Retiro (-)</span>`;
      } else {
        tipoBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/30"><i data-lucide="arrow-down-left" class="w-3 h-3"></i> Depósito (+)</span>`;
      }

      tr.innerHTML = `
        <td class="py-3 px-4 text-xs text-slate-400 font-medium whitespace-nowrap">${m.fecha}</td>
        <td class="py-3 px-4 font-bold text-white whitespace-nowrap">
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${isCargoTarjeta ? 'bg-purple-400' : (isIngreso ? 'bg-emerald-400' : 'bg-rose-400')}"></span>
            ${m.cajitaNombre}
          </span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          ${tipoBadge}
        </td>
        <td class="py-3 px-4 text-xs text-slate-300 font-medium">${m.concepto}</td>
        <td class="py-3 px-4 text-right font-black whitespace-nowrap ${isCargoTarjeta ? 'text-purple-300' : (isIngreso ? 'text-emerald-400' : 'text-rose-400')}">
          ${isIngreso ? '+' : '-'}$${Number(m.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </td>
        <td class="py-3 px-4 text-center">
          <button data-action="delete-cmov" data-id="${m.id}" title="Eliminar movimiento" class="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-colors flex mx-auto">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (deleteCallback) {
      document.querySelectorAll('[data-action="delete-cmov"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          deleteCallback(e.currentTarget.dataset.id);
        });
      });
    }

    if (this.lucide) this.lucide.createIcons();
  }

  switchTab(tabId) {
    const tabs = ['tab-dashboard', 'tab-semanal', 'tab-deudas', 'tab-movimientos', 'tab-cajitas', 'tab-ajustes'];
    tabs.forEach(t => {
      const el = document.getElementById(t);
      const btn = document.getElementById('btn-' + t);
      if (t === tabId) {
        if (el) {
          el.classList.remove('hidden');
          el.classList.add('animate-fade-in');
        }
        if (btn) {
          btn.className = "tab-btn px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 bg-gradient-to-r from-emerald-600/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner";
        }
      } else {
        if (el) {
          el.classList.add('hidden');
          el.classList.remove('animate-fade-in');
        }
        if (btn) {
          btn.className = "tab-btn px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent";
        }
      }
    });

    // Mobile nav active style
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.remove('text-slate-400');
        btn.classList.add('text-emerald-400');
      } else if (btn.dataset.tab) {
        btn.classList.remove('text-emerald-400');
        btn.classList.add('text-slate-400');
      }
    });

    if (this.lucide) this.lucide.createIcons();
  }

  openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex', 'animate-fade-in-fast');
    
    const today = new Date().toISOString().split('T')[0];
    if (id === 'modal-transaccion') {
      const el = document.getElementById('txFecha');
      if (el && !el.value) el.value = today;
    } else if (id === 'modal-abono-deuda') {
      const el = document.getElementById('abonoFecha');
      if (el && !el.value) el.value = today;
    } else if (id === 'modal-cajita-movimiento') {
      const el = document.getElementById('cmovFecha');
      if (el && !el.value) el.value = today;
    } else if (id === 'modal-cajita-transferir') {
      const el = document.getElementById('trFecha');
      if (el && !el.value) el.value = today;
    }
  }

  closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('flex', 'animate-fade-in-fast');
    modal.classList.add('hidden');
  }

  launchConfetti() {
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#059669', '#fcd34d', '#3b82f6', '#6366f1', '#a855f7', '#ec4899']
      });
    }
  }
}
