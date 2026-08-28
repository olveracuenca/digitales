const INITIAL_DEBTS = [
  { id: 'deb-1', nombre: 'Carro Yaris', acreedor: 'Crédito Automotriz', inicial: 84000, mensual: 4000, dia: 15, quincena: 'Quincena 1', restante: 80000, fin: 'Mayo 2028', color: 'rose', pagadoEsteMes: false },
  { id: 'deb-2', nombre: 'Préstamo Carranza', acreedor: 'Préstamo Personal', inicial: 21500, mensual: 4000, dia: 30, quincena: 'Quincena 2', restante: 17500, fin: 'Febrero 2027', color: 'amber', pagadoEsteMes: false },
  { id: 'deb-3', nombre: 'Préstamo Padre', acreedor: 'Deuda Familiar', inicial: 8000, mensual: 1100, dia: 20, quincena: 'Quincena 1', restante: 6900, fin: 'Abril 2027', color: 'teal', pagadoEsteMes: false },
  { id: 'deb-4', nombre: 'Plan Celular (Equipo)', acreedor: 'Telefonía', inicial: 6300, mensual: 700, dia: 25, quincena: 'Quincena 1', restante: 6300, fin: 'Mayo 2027', color: 'indigo', pagadoEsteMes: false },
];

const INITIAL_FIXED = [
  { id: 'fix-1', concepto: 'Luz (CFE)', categoria: 'Servicios Hogar', monto: 500, dia: 10, quincena: 'Quincena 2', pagado: false },
  { id: 'fix-2', concepto: 'Agua Potable', categoria: 'Servicios Hogar', monto: 300, dia: 12, quincena: 'Quincena 2', pagado: false },
  { id: 'fix-3', concepto: 'Internet Fibra Hogar', categoria: 'Telecomunicaciones', monto: 1000, dia: 30, quincena: 'Quincena 2', pagado: false },
  { id: 'fix-4', concepto: 'Gas Natural / LP', categoria: 'Servicios Hogar', monto: 50, dia: 22, quincena: 'Quincena 1', pagado: false },
  { id: 'fix-5', concepto: 'Mandado / Despensa (Q1)', categoria: 'Alimentación', monto: 1400, dia: 1, quincena: 'Quincena 2', pagado: false },
  { id: 'fix-6', concepto: 'Mandado / Despensa (Q2)', categoria: 'Alimentación', monto: 1400, dia: 16, quincena: 'Quincena 1', pagado: false },
  { id: 'fix-7', concepto: 'Gasolina Vehículo (Q1)', categoria: 'Transporte', monto: 500, dia: 1, quincena: 'Quincena 2', pagado: false },
  { id: 'fix-8', concepto: 'Gasolina Vehículo (Q2)', categoria: 'Transporte', monto: 500, dia: 16, quincena: 'Quincena 1', pagado: false },
];

const INITIAL_TRANSACTIONS = [
  { id: 'tx-0', fecha: '2026-08-30', semanaNum: 1, concepto: 'Pago Internet (Adelantado)', categoria: 'Telecomunicaciones', metodo: 'Transferencia SPEI', monto: 1000, tipo: 'GASTO' },
  { id: 'tx-1', fecha: '2026-09-01', semanaNum: 1, concepto: 'Mandado Semanal Soriana', categoria: 'Alimentación', metodo: 'Tarjeta Débito', monto: 680, tipo: 'GASTO' },
  { id: 'tx-2', fecha: '2026-09-03', semanaNum: 1, concepto: 'Carga Gasolina Mobil', categoria: 'Transporte', metodo: 'Efectivo', monto: 250, tipo: 'GASTO' },
  { id: 'tx-3', fecha: '2026-09-04', semanaNum: 1, concepto: 'Cena Tacos / Restaurante', categoria: 'Gustos', metodo: 'Tarjeta Débito', monto: 250, tipo: 'GASTO' },
  { id: 'tx-4', fecha: '2026-09-08', semanaNum: 2, concepto: 'Ponchadura de llanta y talachero', categoria: 'Imprevistos', metodo: 'Efectivo', monto: 150, tipo: 'GASTO' },
  { id: 'tx-5', fecha: '2026-09-10', semanaNum: 2, concepto: 'Pago Recibo Luz CFE', categoria: 'Servicios Hogar', metodo: 'Transferencia SPEI', monto: 500, tipo: 'GASTO' },
];

const START_DATE = new Date(2026, 7, 30); // 30 Aug 2026
const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

class Model {
  constructor() {
    this.appState = this.getDefaultState();
    this.loadState();
  }

  getDefaultState() {
    return {
      sueldoMensual: 20000,
      ahorroMeta: 2000,
      gustosMeta: 1500,
      imprevistosMeta: 1050,
      debts: JSON.parse(JSON.stringify(INITIAL_DEBTS)),
      fixedExpenses: JSON.parse(JSON.stringify(INITIAL_FIXED)),
      transactions: JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)),
      paidItemsByWeek: { 'paid-1-fix-3-0': true, 'fix-3-0': true } // Internet 30 de agosto ya pagado
    };
  }

  loadState() {
    const saved = localStorage.getItem('finanzas_pro_state_mvc');
    if (saved) {
      try {
        this.appState = JSON.parse(saved);
        
        if (!this.appState.paidItemsByWeek) {
          this.appState.paidItemsByWeek = {};
        }

        // MIGRATION: Update Internet payment day to 30
        if (this.appState.fixedExpenses) {
          const internet = this.appState.fixedExpenses.find(f => f.id === 'fix-3');
          if (internet && internet.dia !== 30) {
            internet.dia = 30;
            internet.quincena = 'Quincena 2';
          }
        }

        // Mark August 30th as paid since the user already covered it
        if (!this.appState.paidItemsByWeek['paid-1-fix-3-0']) {
          this.appState.paidItemsByWeek['paid-1-fix-3-0'] = true;
          this.appState.paidItemsByWeek['fix-3-0'] = true;
          if (this.appState.transactions && !this.appState.transactions.some(t => t.id === 'tx-0' || t.concepto.includes('Pago Internet (Adelantado)'))) {
            this.appState.transactions.unshift({
              id: 'tx-0',
              fecha: '2026-08-30',
              semanaNum: 1,
              concepto: 'Pago Internet (Adelantado)',
              categoria: 'Telecomunicaciones',
              metodo: 'Transferencia SPEI',
              monto: 1000,
              tipo: 'GASTO'
            });
          }
        }

        // MIGRATION: Accountant logic to align expenses to the correct paycheck
        const correctQuincena = (dia) => {
            if (dia >= 15 && dia <= 29) return 'Quincena 1';
            return 'Quincena 2';
        };

        if (this.appState.debts) {
          this.appState.debts.forEach(d => { d.quincena = correctQuincena(d.dia); });
        }
        if (this.appState.fixedExpenses) {
          this.appState.fixedExpenses.forEach(f => { f.quincena = correctQuincena(f.dia); });
        }
        if (this.appState.transactions) {
          this.appState.transactions.forEach(t => {
            t.semanaNum = Number(t.semanaNum);
            t.monto = Number(t.monto);
          });
        }
        
      } catch (e) {
        console.error("Error al cargar estado:", e);
      }
    }
  }

  saveState() {
    localStorage.setItem('finanzas_pro_state_mvc', JSON.stringify(this.appState));
  }

  formatDate(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  generate52Weeks() {
    const weeks = [];
    
    // Copy remaining balances to project them over the 52 weeks
    const projectedDebts = {};
    this.appState.debts.forEach(d => {
      projectedDebts[d.id] = d.restante;
    });

    for (let i = 0; i < 52; i++) {
      const wStart = new Date(START_DATE);
      wStart.setDate(START_DATE.getDate() + (i * 7));
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);

      const midDay = new Date(wStart);
      midDay.setDate(wStart.getDate() + 3);

      const mNum = midDay.getMonth();
      const yNum = midDay.getFullYear();
      const qNum = midDay.getDate() <= 15 ? 1 : 2;

      const scheduledItems = [];
      let scheduledSum = 0;
      let weekBaseIncome = 0;

      for (let d = 0; d < 7; d++) {
        const currentDay = new Date(wStart);
        currentDay.setDate(wStart.getDate() + d);
        const dayVal = currentDay.getDate();
        const yrVal = currentDay.getFullYear();
        const moVal = currentDay.getMonth();
        
        const lastDayOfMonth = new Date(yrVal, moVal + 1, 0).getDate();
        const isQ1Payday = dayVal === 15;
        // Se paga el 30, o si el mes termina antes del 30 (como febrero) en el último día
        const isQ2Payday = (dayVal === 30) || (dayVal === lastDayOfMonth && lastDayOfMonth < 30);

        if (isQ1Payday || isQ2Payday) {
            weekBaseIncome += this.appState.sueldoMensual / 2;
        }

        if (isQ1Payday) {
            // Gastos fijos Q1
            this.appState.fixedExpenses.filter(f => f.quincena === 'Quincena 1').forEach(f => {
                scheduledItems.push({ 
                  key: `${f.id}-${i}`, 
                  name: f.concepto, 
                  monto: f.monto, 
                  type: 'fijo', 
                  categoria: f.categoria || 'Servicios Hogar',
                  fixedId: f.id 
                });
                scheduledSum += f.monto;
            });
            // Deudas Q1
            this.appState.debts.filter(d => d.quincena === 'Quincena 1').forEach(deb => {
                if (projectedDebts[deb.id] > 0) {
                    const montoPagar = Math.min(projectedDebts[deb.id], deb.mensual);
                    scheduledItems.push({ 
                      key: `${deb.id}-${i}`, 
                      name: deb.nombre + (projectedDebts[deb.id] <= deb.mensual ? ' (Finiquito)' : ''), 
                      monto: montoPagar, 
                      type: 'deuda', 
                      debtId: deb.id,
                      categoria: 'Deuda' 
                    });
                    scheduledSum += montoPagar;
                    projectedDebts[deb.id] -= montoPagar;
                }
            });
        }

        if (isQ2Payday) {
            // Gastos fijos Q2
            this.appState.fixedExpenses.filter(f => f.quincena === 'Quincena 2').forEach(f => {
                scheduledItems.push({ 
                  key: `${f.id}-${i}`, 
                  name: f.concepto, 
                  monto: f.monto, 
                  type: 'fijo', 
                  categoria: f.categoria || 'Servicios Hogar',
                  fixedId: f.id 
                });
                scheduledSum += f.monto;
            });
            // Deudas Q2
            this.appState.debts.filter(d => d.quincena === 'Quincena 2').forEach(deb => {
                if (projectedDebts[deb.id] > 0) {
                    const montoPagar = Math.min(projectedDebts[deb.id], deb.mensual);
                    scheduledItems.push({ 
                      key: `${deb.id}-${i}`, 
                      name: deb.nombre + (projectedDebts[deb.id] <= deb.mensual ? ' (Finiquito)' : ''), 
                      monto: montoPagar, 
                      type: 'deuda', 
                      debtId: deb.id,
                      categoria: 'Deuda' 
                    });
                    scheduledSum += montoPagar;
                    projectedDebts[deb.id] -= montoPagar;
                }
            });
        }
      }

      weeks.push({
        num: i + 1,
        start: wStart,
        end: wEnd,
        periodStr: `${this.formatDate(wStart)} - ${this.formatDate(wEnd)}`,
        monthStr: `${MONTH_NAMES[mNum]} ${yNum}`,
        quincenaStr: `Quincena ${qNum} (${MONTH_NAMES[mNum].slice(0,3)})`,
        scheduledItems,
        scheduledSum,
        baseIncome: weekBaseIncome
      });
    }
    return weeks;
  }

  getCurrentWeekIndex() {
    const now = new Date();
    if (now < START_DATE) return 0;
    const diffMs = now - START_DATE;
    const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
    return Math.min(Math.max(diffWeeks, 0), 51);
  }

  addTransaction(tx) {
    tx.semanaNum = Number(tx.semanaNum);
    tx.monto = Number(tx.monto);
    this.appState.transactions.unshift(tx);
    this.saveState();
  }

  deleteTransaction(id) {
    const tx = this.appState.transactions.find(t => t.id === id);
    if (tx) {
      if (tx.paidKey && this.appState.paidItemsByWeek[tx.paidKey]) {
        this.appState.paidItemsByWeek[tx.paidKey] = false;
      }
      if (tx.debtId) {
        const debtObj = this.appState.debts.find(d => d.id === tx.debtId);
        if (debtObj) {
          debtObj.restante = Math.min(debtObj.inicial, debtObj.restante + Number(tx.monto));
        }
      }
    }
    this.appState.transactions = this.appState.transactions.filter(t => t.id !== id);
    this.saveState();
  }

  togglePayment(paidKey, itemName, monto, semanaNum, debtId, categoria) {
    const numSemana = Number(semanaNum);
    const numMonto = Number(monto);
    const currentVal = !!this.appState.paidItemsByWeek[paidKey];
    this.appState.paidItemsByWeek[paidKey] = !currentVal;
    
    let isNewPayment = false;

    if (!currentVal) {
      isNewPayment = true;
      
      const weeks = this.generate52Weeks();
      const targetWeek = weeks[numSemana - 1];
      let txDate = new Date().toISOString().split('T')[0];
      if (targetWeek) {
        const today = new Date();
        if (today < targetWeek.start || today > targetWeek.end) {
          const y = targetWeek.start.getFullYear();
          const m = String(targetWeek.start.getMonth() + 1).padStart(2, '0');
          const d = String(targetWeek.start.getDate()).padStart(2, '0');
          txDate = `${y}-${m}-${d}`;
        }
      }

      this.appState.transactions.unshift({
        id: 'tx-paid-' + paidKey,
        paidKey: paidKey,
        fecha: txDate,
        semanaNum: numSemana,
        concepto: debtId ? `Abono: ${itemName}` : `Pago: ${itemName}`,
        categoria: categoria || (debtId ? 'Deuda' : 'Servicios Hogar'),
        metodo: 'Transferencia SPEI',
        monto: numMonto,
        tipo: 'GASTO',
        debtId: debtId || null
      });

      if (debtId) {
        const debtObj = this.appState.debts.find(d => d.id === debtId);
        if (debtObj && debtObj.restante > 0) {
          debtObj.restante = Math.max(0, debtObj.restante - numMonto);
        }
      }
    } else {
      // Revertir transacción si se desmarca
      const txIndex = this.appState.transactions.findIndex(t => t.paidKey === paidKey || t.id === 'tx-paid-' + paidKey);
      if (txIndex !== -1) {
        const removedTx = this.appState.transactions.splice(txIndex, 1)[0];
        if (removedTx && removedTx.debtId) {
          const debtObj = this.appState.debts.find(d => d.id === removedTx.debtId);
          if (debtObj) {
            debtObj.restante = Math.min(debtObj.inicial, debtObj.restante + Number(removedTx.monto));
          }
        }
      } else if (debtId) {
        const debtObj = this.appState.debts.find(d => d.id === debtId);
        if (debtObj) {
          debtObj.restante = Math.min(debtObj.inicial, debtObj.restante + numMonto);
        }
      }
    }

    this.saveState();
    return isNewPayment;
  }

  quickPayDebt(debtId, currIdx) {
    const debt = this.appState.debts.find(d => d.id === debtId);
    if (!debt || debt.restante <= 0) return false;
    
    const montoAbono = Math.min(debt.restante, debt.mensual);
    debt.restante = Math.max(0, debt.restante - montoAbono);
    
    const semNum = Number(currIdx) + 1;
    const paidKey = `paid-${semNum}-${debtId}-${currIdx}`;
    this.appState.paidItemsByWeek[paidKey] = true;

    this.appState.transactions.unshift({
      id: 'tx-quick-' + Date.now(),
      paidKey: paidKey,
      fecha: new Date().toISOString().split('T')[0],
      semanaNum: semNum,
      concepto: `Abono Mensual: ${debt.nombre}`,
      categoria: 'Deuda',
      metodo: 'Transferencia SPEI',
      monto: Number(montoAbono),
      tipo: 'GASTO',
      debtId: debtId
    });

    this.saveState();
    return true;
  }

  resetDefaultData() {
    localStorage.removeItem('finanzas_pro_state_mvc');
    this.appState = this.getDefaultState();
    this.saveState();
  }

  importData(importedData) {
    if (importedData.debts && importedData.transactions) {
      this.appState = importedData;
      this.saveState();
      return true;
    }
    return false;
  }
}
