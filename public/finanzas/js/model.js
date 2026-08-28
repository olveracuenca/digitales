const INITIAL_DEBTS = [
  { id: 'deb-1', nombre: 'Carro Yaris', acreedor: 'Crédito Automotriz', inicial: 84000, mensual: 4000, dia: 15, quincena: 'Quincena 1', restante: 84000, fin: 'Mayo 2028', color: 'rose' },
  { id: 'deb-2', nombre: 'Préstamo Carranza', acreedor: 'Préstamo Personal', inicial: 21500, mensual: 4000, dia: 30, quincena: 'Quincena 2', restante: 21500, fin: 'Febrero 2027', color: 'amber' },
  { id: 'deb-3', nombre: 'Préstamo Padre', acreedor: 'Deuda Familiar', inicial: 8000, mensual: 1100, dia: 20, quincena: 'Quincena 1', restante: 8000, fin: 'Abril 2027', color: 'teal' },
  { id: 'deb-4', nombre: 'Plan Celular (Equipo)', acreedor: 'Telefonía', inicial: 6300, mensual: 700, dia: 25, quincena: 'Quincena 1', restante: 6300, fin: 'Mayo 2027', color: 'indigo' },
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
  { id: 'tx-0', fecha: '2026-08-30', semanaNum: 1, concepto: 'Pago Internet (Adelantado)', categoria: 'Telecomunicaciones', metodo: 'Transferencia SPEI', monto: 1000, tipo: 'GASTO', paidKey: 'paid-1-fix-3-0' },
  { id: 'tx-1', fecha: '2026-09-01', semanaNum: 1, concepto: 'Mandado Semanal Soriana', categoria: 'Alimentación', metodo: 'Tarjeta Débito', monto: 680, tipo: 'GASTO' },
  { id: 'tx-2', fecha: '2026-09-03', semanaNum: 1, concepto: 'Carga Gasolina Mobil', categoria: 'Transporte', metodo: 'Efectivo', monto: 250, tipo: 'GASTO' },
  { id: 'tx-3', fecha: '2026-09-04', semanaNum: 1, concepto: 'Cena Tacos / Restaurante', categoria: 'Gustos', metodo: 'Tarjeta Débito', monto: 250, tipo: 'GASTO' },
  { id: 'tx-4', fecha: '2026-09-08', semanaNum: 2, concepto: 'Ponchadura de llanta y talachero', categoria: 'Imprevistos', metodo: 'Efectivo', monto: 150, tipo: 'GASTO' },
  { id: 'tx-5', fecha: '2026-09-10', semanaNum: 2, concepto: 'Pago Recibo Luz CFE', categoria: 'Servicios Hogar', metodo: 'Transferencia SPEI', monto: 500, tipo: 'GASTO' },
];

const INITIAL_CAJITAS = [
  {
    id: 'caj-1',
    nombre: 'Dinero Mío',
    asignado: 'Mío',
    color: 'indigo',
    icono: 'briefcase',
    meta: 0,
    descripcion: 'Bolsillo personal para gastos y ahorros propios',
    creadaEn: '2026-08-30'
  },
  {
    id: 'caj-2',
    nombre: 'Dinero Esposa',
    asignado: 'Esposa',
    color: 'rose',
    icono: 'heart',
    meta: 0,
    descripcion: 'Bolsillo personal de mi esposa',
    creadaEn: '2026-08-30'
  },
  {
    id: 'caj-3',
    nombre: 'Fondo de Emergencia',
    asignado: 'Compartido',
    color: 'emerald',
    icono: 'shield-check',
    meta: 10000,
    descripcion: 'Fondo de seguridad y reserva familiar',
    creadaEn: '2026-08-30'
  }
];

const INITIAL_CAJITAS_MOVIMIENTOS = [
  {
    id: 'cmov-1',
    cajitaId: 'caj-1',
    tipo: 'INGRESO',
    monto: 100,
    concepto: 'Aporte / saldo inicial personal',
    fecha: '2026-08-30',
    creadoEn: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'cmov-2',
    cajitaId: 'caj-2',
    tipo: 'INGRESO',
    monto: 200,
    concepto: 'Aporte / saldo inicial de mi esposa',
    fecha: '2026-08-30',
    creadoEn: '2026-08-30T10:00:00.000Z'
  }
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
      cajitas: JSON.parse(JSON.stringify(INITIAL_CAJITAS)),
      cajitasMovimientos: JSON.parse(JSON.stringify(INITIAL_CAJITAS_MOVIMIENTOS)),
      paidItemsByWeek: { 'paid-1-fix-3-0': true, 'fix-3-0': true } // Internet 30 de agosto ya pagado
    };
  }

  recalculateDebtBalances() {
    if (!this.appState.debts || !Array.isArray(this.appState.debts)) return;
    
    this.appState.debts.forEach(d => {
      d.inicial = Number(d.inicial) || 0;
      d.mensual = Number(d.mensual) || 0;
      
      const totalAbonado = (this.appState.transactions || [])
        .filter(t => t.debtId === d.id && t.tipo === 'GASTO')
        .reduce((sum, t) => sum + Number(t.monto), 0);
      
      d.restante = Math.max(0, d.inicial - totalAbonado);
    });
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
              tipo: 'GASTO',
              paidKey: 'paid-1-fix-3-0'
            });
          }
        }

        // Alignment of Paychecks (Quincena 1: 15-29, Quincena 2: 30-14)
        const correctQuincena = (dia) => {
            const d = Number(dia);
            if (d >= 15 && d <= 29) return 'Quincena 1';
            return 'Quincena 2';
        };

        if (this.appState.debts) {
          this.appState.debts.forEach(d => { 
            d.quincena = correctQuincena(d.dia);
            d.inicial = Number(d.inicial) || 0;
            d.mensual = Number(d.mensual) || 0;
          });
        }
        if (this.appState.fixedExpenses) {
          this.appState.fixedExpenses.forEach(f => { 
            f.quincena = correctQuincena(f.dia);
            f.monto = Number(f.monto) || 0;
          });
        }
        if (this.appState.transactions) {
          this.appState.transactions.forEach(t => {
            t.semanaNum = Number(t.semanaNum);
            t.monto = Number(t.monto);
          });
        }

        // SANITIZATION: Recalculate all debt balances so they start at `inicial` unless actual payment transactions exist
        this.recalculateDebtBalances();

        // MIGRATION: Cajitas (Cuentas separadas)
        if (!this.appState.cajitas || !Array.isArray(this.appState.cajitas) || this.appState.cajitas.length === 0) {
          this.appState.cajitas = JSON.parse(JSON.stringify(INITIAL_CAJITAS));
        }
        if (!this.appState.cajitasMovimientos || !Array.isArray(this.appState.cajitasMovimientos)) {
          this.appState.cajitasMovimientos = JSON.parse(JSON.stringify(INITIAL_CAJITAS_MOVIMIENTOS));
        }

        if (this.appState.cajitasMovimientos) {
          this.appState.cajitasMovimientos.forEach(m => {
            m.monto = Number(m.monto);
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

  // ================= DEBTS METHODS ================= //

  getDebts() {
    this.recalculateDebtBalances();
    return (this.appState.debts || []).map(d => {
      const pagado = Math.max(0, d.inicial - d.restante);
      const progresoPct = d.inicial > 0 ? Math.min(100, Math.round((pagado / d.inicial) * 100)) : 100;
      return {
        ...d,
        pagado,
        progresoPct,
        isLiquidada: d.restante <= 0
      };
    });
  }

  getDebtById(id) {
    const debts = this.getDebts();
    return debts.find(d => d.id === id) || null;
  }

  addDebt({ nombre, acreedor, inicial, mensual, dia, fin, color }) {
    const numDia = Number(dia) || 15;
    const quincena = (numDia >= 15 && numDia <= 29) ? 'Quincena 1' : 'Quincena 2';
    const numInicial = Number(inicial) || 0;
    const numMensual = Number(mensual) || 0;

    const newDebt = {
      id: 'deb-' + Date.now(),
      nombre: nombre.trim(),
      acreedor: acreedor ? acreedor.trim() : 'Préstamo',
      inicial: numInicial,
      mensual: numMensual,
      dia: numDia,
      quincena: quincena,
      restante: numInicial,
      fin: fin ? fin.trim() : 'Por definir',
      color: color || 'indigo'
    };

    if (!this.appState.debts) this.appState.debts = [];
    this.appState.debts.push(newDebt);
    this.saveState();
    return newDebt;
  }

  updateDebt(id, data) {
    const idx = (this.appState.debts || []).findIndex(d => d.id === id);
    if (idx === -1) return false;

    const numDia = data.dia !== undefined ? Number(data.dia) : this.appState.debts[idx].dia;
    const quincena = (numDia >= 15 && numDia <= 29) ? 'Quincena 1' : 'Quincena 2';
    const numInicial = data.inicial !== undefined ? Number(data.inicial) : this.appState.debts[idx].inicial;
    const numMensual = data.mensual !== undefined ? Number(data.mensual) : this.appState.debts[idx].mensual;

    this.appState.debts[idx] = {
      ...this.appState.debts[idx],
      nombre: data.nombre ? data.nombre.trim() : this.appState.debts[idx].nombre,
      acreedor: data.acreedor !== undefined ? data.acreedor.trim() : this.appState.debts[idx].acreedor,
      inicial: numInicial,
      mensual: numMensual,
      dia: numDia,
      quincena: quincena,
      fin: data.fin !== undefined ? data.fin.trim() : this.appState.debts[idx].fin,
      color: data.color || this.appState.debts[idx].color
    };

    this.recalculateDebtBalances();
    this.saveState();
    return true;
  }

  deleteDebt(id) {
    if (!this.appState.debts) return false;
    this.appState.debts = this.appState.debts.filter(d => d.id !== id);
    this.saveState();
    return true;
  }

  addDebtAbono({ debtId, monto, fecha, metodo, nota, semanaNum }) {
    const numMonto = Number(monto);
    if (isNaN(numMonto) || numMonto <= 0) return { success: false, error: 'Monto inválido' };

    const debt = (this.appState.debts || []).find(d => d.id === debtId);
    if (!debt) return { success: false, error: 'Deuda no encontrada' };

    const txDate = fecha || new Date().toISOString().split('T')[0];
    let semNum = Number(semanaNum);
    if (!semNum) {
      const dObj = new Date(txDate);
      const diffWeeks = Math.floor((dObj - START_DATE) / (7 * 24 * 60 * 60 * 1000)) + 1;
      semNum = Math.min(Math.max(diffWeeks, 1), 52);
    }

    const tx = {
      id: 'tx-abono-' + Date.now(),
      fecha: txDate,
      semanaNum: semNum,
      concepto: nota ? `Abono a ${debt.nombre}: ${nota.trim()}` : `Abono a Deuda: ${debt.nombre}`,
      categoria: 'Deuda',
      metodo: metodo || 'Transferencia SPEI',
      monto: numMonto,
      tipo: 'GASTO',
      debtId: debt.id
    };

    this.appState.transactions.unshift(tx);
    this.recalculateDebtBalances();
    this.saveState();
    return { success: true, transaction: tx };
  }

  // ================= FIXED EXPENSES METHODS ================= //

  getFixedExpenses() {
    return (this.appState.fixedExpenses || []).map(f => ({
      ...f,
      monto: Number(f.monto) || 0
    }));
  }

  getFixedExpenseById(id) {
    return (this.appState.fixedExpenses || []).find(f => f.id === id) || null;
  }

  addFixedExpense({ concepto, categoria, monto, dia }) {
    const numDia = Number(dia) || 1;
    const quincena = (numDia >= 15 && numDia <= 29) ? 'Quincena 1' : 'Quincena 2';
    const numMonto = Number(monto) || 0;

    const newFixed = {
      id: 'fix-' + Date.now(),
      concepto: concepto.trim(),
      categoria: categoria || 'Servicios Hogar',
      monto: numMonto,
      dia: numDia,
      quincena: quincena,
      pagado: false
    };

    if (!this.appState.fixedExpenses) this.appState.fixedExpenses = [];
    this.appState.fixedExpenses.push(newFixed);
    this.saveState();
    return newFixed;
  }

  updateFixedExpense(id, data) {
    const idx = (this.appState.fixedExpenses || []).findIndex(f => f.id === id);
    if (idx === -1) return false;

    const numDia = data.dia !== undefined ? Number(data.dia) : this.appState.fixedExpenses[idx].dia;
    const quincena = (numDia >= 15 && numDia <= 29) ? 'Quincena 1' : 'Quincena 2';
    const numMonto = data.monto !== undefined ? Number(data.monto) : this.appState.fixedExpenses[idx].monto;

    this.appState.fixedExpenses[idx] = {
      ...this.appState.fixedExpenses[idx],
      concepto: data.concepto ? data.concepto.trim() : this.appState.fixedExpenses[idx].concepto,
      categoria: data.categoria || this.appState.fixedExpenses[idx].categoria,
      monto: numMonto,
      dia: numDia,
      quincena: quincena
    };

    this.saveState();
    return true;
  }

  deleteFixedExpense(id) {
    if (!this.appState.fixedExpenses) return false;
    this.appState.fixedExpenses = this.appState.fixedExpenses.filter(f => f.id !== id);
    this.saveState();
    return true;
  }

  // ================= CAJITAS (CUENTAS SEPARADAS) METHODS ================= //

  getCajitaSaldo(cajitaId) {
    if (!this.appState.cajitasMovimientos) return 0;
    const movs = this.appState.cajitasMovimientos.filter(m => m.cajitaId === cajitaId);
    const ingresos = movs.filter(m => m.tipo === 'INGRESO').reduce((acc, m) => acc + Number(m.monto), 0);
    const egresos = movs.filter(m => m.tipo === 'EGRESO').reduce((acc, m) => acc + Number(m.monto), 0);
    return Math.max(0, ingresos - egresos);
  }

  getCajitas() {
    if (!this.appState.cajitas) return [];
    return this.appState.cajitas.map(c => ({
      ...c,
      saldo: this.getCajitaSaldo(c.id)
    }));
  }

  getCajitaById(id) {
    const cajita = (this.appState.cajitas || []).find(c => c.id === id);
    if (!cajita) return null;
    return {
      ...cajita,
      saldo: this.getCajitaSaldo(cajita.id)
    };
  }

  getTotalCajitas() {
    const cajitas = this.getCajitas();
    return cajitas.reduce((acc, c) => acc + Number(c.saldo), 0);
  }

  getCajitasSummaryByOwner() {
    const cajitas = this.getCajitas();
    let mio = 0;
    let esposa = 0;
    let compartido = 0;

    cajitas.forEach(c => {
      const owner = (c.asignado || '').toLowerCase();
      if (owner.includes('mío') || owner.includes('mio') || owner.includes('personal') || owner.includes('yo')) {
        mio += c.saldo;
      } else if (owner.includes('esposa') || owner.includes('pareja') || owner.includes('ella')) {
        esposa += c.saldo;
      } else {
        compartido += c.saldo;
      }
    });

    const total = mio + esposa + compartido;
    return {
      mio,
      esposa,
      compartido,
      total,
      count: cajitas.length
    };
  }

  getCajitaMovements(cajitaId = null) {
    let movs = this.appState.cajitasMovimientos || [];
    if (cajitaId && cajitaId !== 'ALL') {
      movs = movs.filter(m => m.cajitaId === cajitaId);
    }
    return movs.map(m => {
      const cajita = (this.appState.cajitas || []).find(c => c.id === m.cajitaId);
      return {
        ...m,
        cajitaNombre: cajita ? cajita.nombre : 'Cajita eliminada',
        cajitaColor: cajita ? cajita.color : 'slate',
        cajitaAsignado: cajita ? cajita.asignado : 'General'
      };
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha) || new Date(b.creadoEn || 0) - new Date(a.creadoEn || 0));
  }

  addCajita({ nombre, asignado, color, icono, meta, descripcion, saldoInicial, conceptoInicial, fechaInicial }) {
    const id = 'caj-' + Date.now();
    const newCajita = {
      id,
      nombre: nombre.trim(),
      asignado: asignado || 'Mío',
      color: color || 'indigo',
      icono: icono || 'wallet',
      meta: Number(meta) || 0,
      descripcion: descripcion ? descripcion.trim() : '',
      creadaEn: new Date().toISOString().split('T')[0]
    };

    if (!this.appState.cajitas) this.appState.cajitas = [];
    this.appState.cajitas.push(newCajita);

    const initialAmount = Number(saldoInicial) || 0;
    if (initialAmount > 0) {
      if (!this.appState.cajitasMovimientos) this.appState.cajitasMovimientos = [];
      this.appState.cajitasMovimientos.unshift({
        id: 'cmov-' + Date.now(),
        cajitaId: id,
        tipo: 'INGRESO',
        monto: initialAmount,
        concepto: conceptoInicial ? conceptoInicial.trim() : 'Saldo inicial',
        fecha: fechaInicial || new Date().toISOString().split('T')[0],
        creadoEn: new Date().toISOString()
      });
    }

    this.saveState();
    return newCajita;
  }

  updateCajita(id, data) {
    const idx = (this.appState.cajitas || []).findIndex(c => c.id === id);
    if (idx === -1) return false;

    this.appState.cajitas[idx] = {
      ...this.appState.cajitas[idx],
      nombre: data.nombre ? data.nombre.trim() : this.appState.cajitas[idx].nombre,
      asignado: data.asignado !== undefined ? data.asignado : this.appState.cajitas[idx].asignado,
      color: data.color || this.appState.cajitas[idx].color,
      icono: data.icono || this.appState.cajitas[idx].icono,
      meta: data.meta !== undefined ? Number(data.meta) : this.appState.cajitas[idx].meta,
      descripcion: data.descripcion !== undefined ? data.descripcion.trim() : this.appState.cajitas[idx].descripcion
    };

    this.saveState();
    return true;
  }

  deleteCajita(id) {
    if (!this.appState.cajitas) return false;
    this.appState.cajitas = this.appState.cajitas.filter(c => c.id !== id);
    if (this.appState.cajitasMovimientos) {
      this.appState.cajitasMovimientos = this.appState.cajitasMovimientos.filter(m => m.cajitaId !== id);
    }
    this.saveState();
    return true;
  }

  addCajitaMovement({ cajitaId, tipo, monto, concepto, fecha }) {
    const numMonto = Number(monto);
    if (isNaN(numMonto) || numMonto <= 0) return { success: false, error: 'Monto inválido' };

    const cajita = (this.appState.cajitas || []).find(c => c.id === cajitaId);
    if (!cajita) return { success: false, error: 'Cajita no encontrada' };

    const currentSaldo = this.getCajitaSaldo(cajitaId);
    if (tipo === 'EGRESO' && numMonto > currentSaldo) {
      return { success: false, error: `Saldo insuficiente en ${cajita.nombre} ($${currentSaldo.toLocaleString()} disponibles)` };
    }

    if (!this.appState.cajitasMovimientos) this.appState.cajitasMovimientos = [];

    const newMov = {
      id: 'cmov-' + Date.now(),
      cajitaId,
      tipo: tipo === 'EGRESO' ? 'EGRESO' : 'INGRESO',
      monto: numMonto,
      concepto: concepto ? concepto.trim() : (tipo === 'EGRESO' ? 'Retiro' : 'Depósito'),
      fecha: fecha || new Date().toISOString().split('T')[0],
      creadoEn: new Date().toISOString()
    };

    this.appState.cajitasMovimientos.unshift(newMov);
    this.saveState();
    return { success: true, movement: newMov };
  }

  deleteCajitaMovement(id) {
    if (!this.appState.cajitasMovimientos) return false;
    this.appState.cajitasMovimientos = this.appState.cajitasMovimientos.filter(m => m.id !== id);
    this.saveState();
    return true;
  }

  transferBetweenCajitas({ fromId, toId, monto, concepto, fecha }) {
    const numMonto = Number(monto);
    if (isNaN(numMonto) || numMonto <= 0) return { success: false, error: 'Monto inválido' };
    if (fromId === toId) return { success: false, error: 'La cajita origen y destino no pueden ser iguales' };

    const fromCaj = (this.appState.cajitas || []).find(c => c.id === fromId);
    const toCaj = (this.appState.cajitas || []).find(c => c.id === toId);
    if (!fromCaj || !toCaj) return { success: false, error: 'Cajita origen o destino no encontrada' };

    const fromSaldo = this.getCajitaSaldo(fromId);
    if (numMonto > fromSaldo) {
      return { success: false, error: `Saldo insuficiente en ${fromCaj.nombre} ($${fromSaldo.toLocaleString()} disponibles)` };
    }

    const txFecha = fecha || new Date().toISOString().split('T')[0];
    const userConcepto = concepto ? ` - ${concepto.trim()}` : '';
    const nowIso = new Date().toISOString();

    if (!this.appState.cajitasMovimientos) this.appState.cajitasMovimientos = [];

    // Egreso origen
    this.appState.cajitasMovimientos.unshift({
      id: 'cmov-tr-out-' + Date.now(),
      cajitaId: fromId,
      tipo: 'EGRESO',
      monto: numMonto,
      concepto: `Transferencia a ${toCaj.nombre}${userConcepto}`,
      fecha: txFecha,
      creadoEn: nowIso
    });

    // Ingreso destino
    this.appState.cajitasMovimientos.unshift({
      id: 'cmov-tr-in-' + (Date.now() + 1),
      cajitaId: toId,
      tipo: 'INGRESO',
      monto: numMonto,
      concepto: `Transferencia desde ${fromCaj.nombre}${userConcepto}`,
      fecha: txFecha,
      creadoEn: nowIso
    });

    this.saveState();
    return { success: true };
  }

  // ================= GENERAL METHODS ================= //

  formatDate(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  generate52Weeks() {
    this.recalculateDebtBalances();
    const weeks = [];
    
    // Track remaining balances through the projected 52 weeks
    const projectedDebts = {};
    (this.appState.debts || []).forEach(d => {
      projectedDebts[d.id] = d.inicial;
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
        const isQ2Payday = (dayVal === 30) || (dayVal === lastDayOfMonth && lastDayOfMonth < 30);

        if (isQ1Payday || isQ2Payday) {
            weekBaseIncome += this.appState.sueldoMensual / 2;
        }

        if (isQ1Payday) {
            // Gastos fijos Q1
            (this.appState.fixedExpenses || []).filter(f => f.quincena === 'Quincena 1').forEach(f => {
                scheduledItems.push({ 
                  key: `${f.id}-${i}`, 
                  name: f.concepto, 
                  monto: Number(f.monto), 
                  type: 'fijo', 
                  categoria: f.categoria || 'Servicios Hogar',
                  fixedId: f.id 
                });
                scheduledSum += Number(f.monto);
            });
            // Deudas Q1
            (this.appState.debts || []).filter(deb => deb.quincena === 'Quincena 1').forEach(deb => {
                const paidKey = `paid-${i + 1}-${deb.id}-${i}`;
                const isPaid = !!this.appState.paidItemsByWeek[paidKey];
                
                if (isPaid || projectedDebts[deb.id] > 0) {
                    const montoPagar = Math.min(Math.max(projectedDebts[deb.id], 0) || deb.mensual, deb.mensual);
                    scheduledItems.push({ 
                      key: `${deb.id}-${i}`, 
                      name: deb.nombre + (projectedDebts[deb.id] <= deb.mensual && projectedDebts[deb.id] > 0 ? ' (Finiquito)' : ''), 
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
            (this.appState.fixedExpenses || []).filter(f => f.quincena === 'Quincena 2').forEach(f => {
                scheduledItems.push({ 
                  key: `${f.id}-${i}`, 
                  name: f.concepto, 
                  monto: Number(f.monto), 
                  type: 'fijo', 
                  categoria: f.categoria || 'Servicios Hogar',
                  fixedId: f.id 
                });
                scheduledSum += Number(f.monto);
            });
            // Deudas Q2
            (this.appState.debts || []).filter(deb => deb.quincena === 'Quincena 2').forEach(deb => {
                const paidKey = `paid-${i + 1}-${deb.id}-${i}`;
                const isPaid = !!this.appState.paidItemsByWeek[paidKey];
                
                if (isPaid || projectedDebts[deb.id] > 0) {
                    const montoPagar = Math.min(Math.max(projectedDebts[deb.id], 0) || deb.mensual, deb.mensual);
                    scheduledItems.push({ 
                      key: `${deb.id}-${i}`, 
                      name: deb.nombre + (projectedDebts[deb.id] <= deb.mensual && projectedDebts[deb.id] > 0 ? ' (Finiquito)' : ''), 
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
    this.recalculateDebtBalances();
    this.saveState();
  }

  deleteTransaction(id) {
    const tx = this.appState.transactions.find(t => t.id === id);
    if (tx) {
      if (tx.paidKey && this.appState.paidItemsByWeek[tx.paidKey]) {
        this.appState.paidItemsByWeek[tx.paidKey] = false;
      }
    }
    this.appState.transactions = this.appState.transactions.filter(t => t.id !== id);
    this.recalculateDebtBalances();
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
        concepto: debtId ? `Abono: ${itemName.replace(' (Finiquito)', '')}` : `Pago: ${itemName}`,
        categoria: categoria || (debtId ? 'Deuda' : 'Servicios Hogar'),
        metodo: 'Transferencia SPEI',
        monto: numMonto,
        tipo: 'GASTO',
        debtId: debtId || null
      });
    } else {
      // Revertir transacción si se desmarca
      const txIndex = this.appState.transactions.findIndex(t => t.paidKey === paidKey || t.id === 'tx-paid-' + paidKey);
      if (txIndex !== -1) {
        this.appState.transactions.splice(txIndex, 1);
      }
    }

    this.recalculateDebtBalances();
    this.saveState();
    return isNewPayment;
  }

  quickPayDebt(debtId, currIdx) {
    const debt = (this.appState.debts || []).find(d => d.id === debtId);
    if (!debt || debt.restante <= 0) return false;
    
    const montoAbono = Math.min(debt.restante, debt.mensual);
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

    this.recalculateDebtBalances();
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
      if (!importedData.cajitas || !Array.isArray(importedData.cajitas)) {
        importedData.cajitas = JSON.parse(JSON.stringify(INITIAL_CAJITAS));
      }
      if (!importedData.cajitasMovimientos || !Array.isArray(importedData.cajitasMovimientos)) {
        importedData.cajitasMovimientos = JSON.parse(JSON.stringify(INITIAL_CAJITAS_MOVIMIENTOS));
      }
      this.appState = importedData;
      this.recalculateDebtBalances();
      this.saveState();
      return true;
    }
    return false;
  }
}
