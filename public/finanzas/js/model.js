const INITIAL_DEBTS = [
  { id: 'deb-1', nombre: 'Carro Yaris', acreedor: 'Crédito Automotriz', inicial: 84000, mensual: 4000, dia: 15, quincena: 'Quincena 1', restante: 80000, fin: 'Mayo 2028', color: 'rose', pagadoEsteMes: false },
  { id: 'deb-2', nombre: 'Préstamo Carranza', acreedor: 'Préstamo Personal', inicial: 21500, mensual: 4000, dia: 30, quincena: 'Quincena 2', restante: 17500, fin: 'Febrero 2027', color: 'amber', pagadoEsteMes: false },
  { id: 'deb-3', nombre: 'Préstamo Padre', acreedor: 'Deuda Familiar', inicial: 8000, mensual: 1100, dia: 20, quincena: 'Quincena 2', restante: 6900, fin: 'Abril 2027', color: 'teal', pagadoEsteMes: false },
  { id: 'deb-4', nombre: 'Plan Celular (Equipo)', acreedor: 'Telefonía', inicial: 6300, mensual: 700, dia: 25, quincena: 'Quincena 2', restante: 6300, fin: 'Mayo 2027', color: 'indigo', pagadoEsteMes: false },
];

const INITIAL_FIXED = [
  { id: 'fix-1', concepto: 'Luz (CFE)', categoria: 'Servicios Hogar', monto: 500, dia: 10, quincena: 'Quincena 1', pagado: false },
  { id: 'fix-2', concepto: 'Agua Potable', categoria: 'Servicios Hogar', monto: 300, dia: 12, quincena: 'Quincena 1', pagado: false },
  { id: 'fix-3', concepto: 'Internet Fibra Hogar', categoria: 'Telecomunicaciones', monto: 1000, dia: 18, quincena: 'Quincena 2', pagado: false },
  { id: 'fix-4', concepto: 'Gas Natural / LP', categoria: 'Servicios Hogar', monto: 50, dia: 22, quincena: 'Quincena 2', pagado: false },
  { id: 'fix-5', concepto: 'Mandado / Despensa (Q1)', categoria: 'Alimentación', monto: 1400, dia: 1, quincena: 'Quincena 1', pagado: false },
  { id: 'fix-6', concepto: 'Mandado / Despensa (Q2)', categoria: 'Alimentación', monto: 1400, dia: 16, quincena: 'Quincena 2', pagado: false },
  { id: 'fix-7', concepto: 'Gasolina Vehículo (Q1)', categoria: 'Transporte', monto: 500, dia: 1, quincena: 'Quincena 1', pagado: false },
  { id: 'fix-8', concepto: 'Gasolina Vehículo (Q2)', categoria: 'Transporte', monto: 500, dia: 16, quincena: 'Quincena 2', pagado: false },
];

const INITIAL_TRANSACTIONS = [
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
      paidItemsByWeek: {}
    };
  }

  loadState() {
    const saved = localStorage.getItem('finanzas_pro_state_mvc');
    if (saved) {
      try {
        this.appState = JSON.parse(saved);
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

      for (let d = 0; d < 7; d++) {
        const currentDay = new Date(wStart);
        currentDay.setDate(wStart.getDate() + d);
        const dayVal = currentDay.getDate();
        const yrVal = currentDay.getFullYear();
        const moVal = currentDay.getMonth();

        if (dayVal === 10) { scheduledItems.push({ key: `luz-${i}`, name: 'Luz CFE', monto: 500, type: 'fijo' }); scheduledSum += 500; }
        if (dayVal === 12) { scheduledItems.push({ key: `agua-${i}`, name: 'Agua Potable', monto: 300, type: 'fijo' }); scheduledSum += 300; }
        if (dayVal === 15) { scheduledItems.push({ key: `yaris-${i}`, name: 'Carro Yaris', monto: 4000, type: 'deuda', debtId: 'deb-1' }); scheduledSum += 4000; }
        if (dayVal === 18) { scheduledItems.push({ key: `net-${i}`, name: 'Internet Fibra', monto: 1000, type: 'fijo' }); scheduledSum += 1000; }
        if (dayVal === 20) {
          if (yrVal === 2026 || (yrVal === 2027 && moVal <= 2)) {
            scheduledItems.push({ key: `padre-${i}`, name: 'Préstamo Padre', monto: 1100, type: 'deuda', debtId: 'deb-3' });
            scheduledSum += 1100;
          } else if (yrVal === 2027 && moVal === 3) {
            scheduledItems.push({ key: `padre-${i}`, name: 'Préstamo Padre (Finiquito)', monto: 300, type: 'deuda', debtId: 'deb-3' });
            scheduledSum += 300;
          }
        }
        if (dayVal === 22) { scheduledItems.push({ key: `gas-${i}`, name: 'Gas LP/Natural', monto: 50, type: 'fijo' }); scheduledSum += 50; }
        if (dayVal === 25) {
          if (yrVal === 2026 || (yrVal === 2027 && moVal <= 4)) {
            scheduledItems.push({ key: `cel-${i}`, name: 'Plan Celular', monto: 700, type: 'deuda', debtId: 'deb-4' });
            scheduledSum += 700;
          }
        }
        if (dayVal === 30 || (moVal === 1 && dayVal === 28)) {
          if (yrVal === 2026) {
            scheduledItems.push({ key: `carranza-${i}`, name: 'Préstamo Carranza', monto: 4000, type: 'deuda', debtId: 'deb-2' });
            scheduledSum += 4000;
          } else if (yrVal === 2027 && moVal === 0) {
            scheduledItems.push({ key: `carranza-${i}`, name: 'Préstamo Carranza (Finiquito)', monto: 1500, type: 'deuda', debtId: 'deb-2' });
            scheduledSum += 1500;
          }
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
        baseIncome: 5000
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
    this.appState.transactions.unshift(tx);
    this.saveState();
  }

  deleteTransaction(id) {
    this.appState.transactions = this.appState.transactions.filter(t => t.id !== id);
    this.saveState();
  }

  togglePayment(paidKey, itemName, monto, semanaNum, debtId) {
    const currentVal = !!this.appState.paidItemsByWeek[paidKey];
    this.appState.paidItemsByWeek[paidKey] = !currentVal;
    
    let isNewPayment = false;

    if (!currentVal) {
      isNewPayment = true;
      
      this.appState.transactions.unshift({
        id: 'tx-' + Date.now(),
        fecha: new Date().toISOString().split('T')[0],
        semanaNum: semanaNum,
        concepto: `Pago Realizado: ${itemName}`,
        categoria: debtId ? 'Deuda' : 'Servicios Hogar',
        metodo: 'Transferencia SPEI',
        monto: Number(monto),
        tipo: 'GASTO'
      });

      if (debtId) {
        const debtObj = this.appState.debts.find(d => d.id === debtId);
        if (debtObj && debtObj.restante > 0) {
          debtObj.restante = Math.max(0, debtObj.restante - monto);
        }
      }
    }

    this.saveState();
    return isNewPayment;
  }

  quickPayDebt(debtId, currIdx) {
    const debt = this.appState.debts.find(d => d.id === debtId);
    if (!debt) return false;
    
    debt.restante = Math.max(0, debt.restante - debt.mensual);
    
    this.appState.transactions.unshift({
      id: 'tx-' + Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      semanaNum: currIdx + 1,
      concepto: `Abono Mensual: ${debt.nombre}`,
      categoria: 'Deuda',
      metodo: 'Transferencia SPEI',
      monto: Number(debt.mensual),
      tipo: 'GASTO'
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
