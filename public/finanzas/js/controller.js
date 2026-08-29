class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.bindEvents();
  }

  async init() {
    await this.model.loadState();
    this.updateAllUI();
  }

  updateAllUI() {
    const weeks = this.model.generate52Weeks();
    const currIdx = this.model.getCurrentWeekIndex();
    const currWeek = weeks[currIdx] || weeks[0];

    const debts = this.model.getDebts();
    const fixedExpenses = this.model.getFixedExpenses();

    this.view.updateHero(currWeek, this.model.appState, weeks, currIdx);
    this.view.renderCharts(this.model.appState);
    this.view.renderWeeks(weeks, currIdx, this.model.appState, this.handleTogglePayment.bind(this));
    
    this.view.renderDebts(debts, {
      onQuickPay: this.handleQuickPay.bind(this),
      onCustomAbono: this.handleCustomAbono.bind(this),
      onEditDebt: this.handleEditDebt.bind(this),
      onDeleteDebt: this.handleDeleteDebt.bind(this)
    });

    this.view.renderFixedExpenses(fixedExpenses, {
      onEditFixed: this.handleEditFixed.bind(this),
      onDeleteFixed: this.handleDeleteFixed.bind(this)
    });

    this.view.renderTransactions(this.model.appState, this.handleDeleteTransaction.bind(this));
    this.view.updateDebtSelectOptions(debts);

    // Cajitas & Tarjetas de Crédito
    const cajitas = this.model.getCajitas();
    const cajitasSummary = this.model.getCajitasSummaryByOwner();
    const cajitasMovements = this.model.getCajitaMovements();

    this.view.renderCajitasSection(cajitas, cajitasSummary, cajitasMovements, {
      onDeposit: this.handleCajitaDeposit.bind(this),
      onWithdraw: this.handleCajitaWithdraw.bind(this),
      onCargo: this.handleCajitaCargo.bind(this),
      onPago: this.handleCajitaPago.bind(this),
      onEditCajita: this.handleEditCajita.bind(this),
      onDeleteCajita: this.handleDeleteCajita.bind(this),
      onDeleteMovement: this.handleDeleteCajitaMovement.bind(this)
    });
  }

  bindEvents() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabId = e.currentTarget.id.replace('btn-', '');
        this.view.switchTab(tabId);
      });
    });

    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabId = e.currentTarget.dataset.tab;
        if (tabId) this.view.switchTab(tabId);
      });
    });

    // Modals open
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.dataset.openModal;
        
        if (modalId === 'modal-deuda') {
          const editIdInput = document.getElementById('debtEditId');
          if (editIdInput) editIdInput.value = '';
          const title = document.getElementById('modalDebtTitle');
          if (title) title.innerText = 'Nueva Deuda';
          const submitBtn = document.getElementById('btnSubmitDebt');
          if (submitBtn) submitBtn.innerText = 'Guardar Deuda';
          const delBtn = document.getElementById('btnDeleteDebtFromModal');
          if (delBtn) delBtn.classList.add('hidden');
          const form = document.getElementById('formDeuda');
          if (form) form.reset();
        } else if (modalId === 'modal-fijo') {
          const editIdInput = document.getElementById('fixEditId');
          if (editIdInput) editIdInput.value = '';
          const title = document.getElementById('modalFixedTitle');
          if (title) title.innerText = 'Nuevo Gasto Fijo / Servicio';
          const submitBtn = document.getElementById('btnSubmitFixed');
          if (submitBtn) submitBtn.innerText = 'Guardar Fijo';
          const delBtn = document.getElementById('btnDeleteFixedFromModal');
          if (delBtn) delBtn.classList.add('hidden');
          const form = document.getElementById('formFijo');
          if (form) form.reset();
        } else if (modalId === 'modal-abono-deuda') {
          const form = document.getElementById('formAbonoDeuda');
          if (form) form.reset();
          const today = new Date().toISOString().split('T')[0];
          const fechaInput = document.getElementById('abonoFecha');
          if (fechaInput) fechaInput.value = today;
        } else if (modalId === 'modal-cajita') {
          const editIdInput = document.getElementById('cajitaEditId');
          if (editIdInput) editIdInput.value = '';
          const title = document.getElementById('modalCajitaTitle');
          if (title) title.innerText = 'Nueva Cajita / Tarjeta';
          const submitBtn = document.getElementById('btnSubmitCajita');
          if (submitBtn) submitBtn.innerText = 'Crear Cajita';
          const delBtn = document.getElementById('btnDeleteCajitaFromModal');
          if (delBtn) delBtn.classList.add('hidden');
          const saldoCont = document.getElementById('cajitaSaldoInicialContainer');
          if (saldoCont) saldoCont.classList.remove('hidden');
          const form = document.getElementById('formCajita');
          if (form) form.reset();

          // Reset to AHORRO
          const radioAhorro = document.querySelector('input[name="cajitaTipo"][value="AHORRO"]');
          if (radioAhorro) radioAhorro.checked = true;
          this.toggleCajitaTipoFields('AHORRO');
        } else if (modalId === 'modal-cajita-movimiento') {
          this.updateCmovModalForSelectedCajita();
        }

        this.view.openModal(modalId);
      });
    });

    // Modals close
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.view.closeModal(e.currentTarget.dataset.closeModal);
      });
    });

    // Cajita Type toggle in #modal-cajita
    document.querySelectorAll('input[name="cajitaTipo"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.toggleCajitaTipoFields(e.target.value);
      });
    });

    // Cajita selection change in #modal-cajita-movimiento
    const cmovCajitaSelect = document.getElementById('cmovCajitaId');
    if (cmovCajitaSelect) {
      cmovCajitaSelect.addEventListener('change', () => {
        this.updateCmovModalForSelectedCajita();
      });
    }

    // Dynamic Debt Selector inside General Transaction Modal
    const txCatSelect = document.getElementById('txCategoria');
    const txDebtContainer = document.getElementById('txDebtSelectionContainer');
    if (txCatSelect && txDebtContainer) {
      txCatSelect.addEventListener('change', (e) => {
        if (e.target.value === 'Deuda') {
          txDebtContainer.classList.remove('hidden');
        } else {
          txDebtContainer.classList.add('hidden');
        }
      });
    }

    // Modal Delete buttons
    const btnDelDebt = document.getElementById('btnDeleteDebtFromModal');
    if (btnDelDebt) {
      btnDelDebt.addEventListener('click', () => {
        const editId = document.getElementById('debtEditId')?.value;
        if (editId) {
          this.view.closeModal('modal-deuda');
          this.handleDeleteDebt(editId);
        }
      });
    }

    const btnDelFixed = document.getElementById('btnDeleteFixedFromModal');
    if (btnDelFixed) {
      btnDelFixed.addEventListener('click', () => {
        const editId = document.getElementById('fixEditId')?.value;
        if (editId) {
          this.view.closeModal('modal-fijo');
          this.handleDeleteFixed(editId);
        }
      });
    }

    const btnDelCajita = document.getElementById('btnDeleteCajitaFromModal');
    if (btnDelCajita) {
      btnDelCajita.addEventListener('click', () => {
        const editId = document.getElementById('cajitaEditId')?.value;
        if (editId) {
          this.view.closeModal('modal-cajita');
          this.handleDeleteCajita(editId);
        }
      });
    }

    // Forms
    const txForm = document.getElementById('formTransaccion');
    if (txForm) txForm.addEventListener('submit', (e) => this.handleSaveTransaction(e));

    const debtForm = document.getElementById('formDeuda');
    if (debtForm) debtForm.addEventListener('submit', (e) => this.handleSaveDebt(e));

    const fixedForm = document.getElementById('formFijo');
    if (fixedForm) fixedForm.addEventListener('submit', (e) => this.handleSaveFixed(e));

    const abonoForm = document.getElementById('formAbonoDeuda');
    if (abonoForm) abonoForm.addEventListener('submit', (e) => this.handleSaveAbonoDeuda(e));

    const cajitaForm = document.getElementById('formCajita');
    if (cajitaForm) cajitaForm.addEventListener('submit', (e) => this.handleSaveCajita(e));

    const cmovForm = document.getElementById('formCajitaMovimiento');
    if (cmovForm) cmovForm.addEventListener('submit', (e) => this.handleSaveCajitaMovement(e));

    const trForm = document.getElementById('formCajitaTransferir');
    if (trForm) trForm.addEventListener('submit', (e) => this.handleSaveCajitaTransfer(e));

    // Filters
    const filterCat = document.getElementById('filterCategory');
    if (filterCat) {
      filterCat.addEventListener('change', () => {
        this.view.renderTransactions(this.model.appState, this.handleDeleteTransaction.bind(this));
      });
    }

    const filterWeek = document.getElementById('filtroSemana');
    if (filterWeek) {
      filterWeek.addEventListener('keyup', () => {
        const weeks = this.model.generate52Weeks();
        const currIdx = this.model.getCurrentWeekIndex();
        this.view.renderWeeks(weeks, currIdx, this.model.appState, this.handleTogglePayment.bind(this));
      });
    }

    const filterCajitaSel = document.getElementById('filterCajitaSelect');
    if (filterCajitaSel) {
      filterCajitaSel.addEventListener('change', () => {
        this.view.renderCajitasMovementsTable(this.model.getCajitaMovements(), this.handleDeleteCajitaMovement.bind(this));
      });
    }

    const filterCajitaTipoSel = document.getElementById('filterCajitaTipo');
    if (filterCajitaTipoSel) {
      filterCajitaTipoSel.addEventListener('change', () => {
        this.view.renderCajitasMovementsTable(this.model.getCajitaMovements(), this.handleDeleteCajitaMovement.bind(this));
      });
    }

    // Config actions
    const btnSaveConfig = document.getElementById('btnSaveConfig');
    if (btnSaveConfig) {
      btnSaveConfig.addEventListener('click', () => {
        this.model.appState.sueldoMensual = Number(document.getElementById('cfgSueldo').value);
        this.model.appState.ahorroMeta = Number(document.getElementById('cfgAhorro').value);
        this.model.appState.gustosMeta = Number(document.getElementById('cfgGustos').value);
        this.model.saveState();
        this.updateAllUI();
        alert('Configuración guardada.');
      });
    }

    const btnExport = document.getElementById('btnExport');
    if (btnExport) btnExport.addEventListener('click', () => this.handleExport());

    const fileImport = document.getElementById('importFileInput');
    if (fileImport) fileImport.addEventListener('change', (e) => this.handleImport(e));

    const btnReset = document.getElementById('btnReset');
    if (btnReset) btnReset.addEventListener('click', () => this.handleReset());
  }

  toggleCajitaTipoFields(tipo) {
    const isCredito = tipo === 'CREDITO';
    const creditoCampos = document.getElementById('cajitaCreditoCampos');
    const metaCont = document.getElementById('cajitaMetaContainer');
    const saldoLabel = document.getElementById('cajitaSaldoInicialLabel');
    const iconoSelect = document.getElementById('cajitaIcono');
    const colorSelect = document.getElementById('cajitaColor');

    if (isCredito) {
      if (creditoCampos) creditoCampos.classList.remove('hidden');
      if (metaCont) metaCont.classList.add('hidden');
      if (saldoLabel) saldoLabel.innerText = 'Saldo Deudor Inicial ($)';
      if (iconoSelect && !document.getElementById('cajitaEditId')?.value) iconoSelect.value = 'credit-card';
      if (colorSelect && !document.getElementById('cajitaEditId')?.value) colorSelect.value = 'purple';
    } else {
      if (creditoCampos) creditoCampos.classList.add('hidden');
      if (metaCont) metaCont.classList.remove('hidden');
      if (saldoLabel) saldoLabel.innerText = 'Saldo Inicial ($)';
      if (iconoSelect && !document.getElementById('cajitaEditId')?.value) iconoSelect.value = 'wallet';
      if (colorSelect && !document.getElementById('cajitaEditId')?.value) colorSelect.value = 'emerald';
    }
  }

  updateCmovModalForSelectedCajita() {
    const cajitaId = document.getElementById('cmovCajitaId')?.value;
    const cajita = this.model.getCajitaById(cajitaId);
    const isCredito = cajita && (cajita.isCredito || cajita.tipoCajita === 'CREDITO');

    const title = document.getElementById('modalCmovTitle');
    const ingresoLabel = document.getElementById('cmovIngresoLabel');
    const egresoLabel = document.getElementById('cmovEgresoLabel');
    const catContainer = document.getElementById('cmovCategoriaContainer');

    if (isCredito) {
      if (title) title.innerText = `Movimiento en Tarjeta: ${cajita.nombre}`;
      if (ingresoLabel) ingresoLabel.innerHTML = `<i data-lucide="shopping-cart" class="w-4 h-4 stroke-[3]"></i> + Cargo / Compra Tarjeta`;
      if (egresoLabel) egresoLabel.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 stroke-[3]"></i> 💳 Pago / Abono a Tarjeta`;
      if (catContainer) catContainer.classList.remove('hidden');
    } else {
      if (title) title.innerText = `Movimiento en Cajita: ${cajita ? cajita.nombre : 'Apartado'}`;
      if (ingresoLabel) ingresoLabel.innerHTML = `<i data-lucide="arrow-down-left" class="w-4 h-4 stroke-[3]"></i> + Meter Dinero`;
      if (egresoLabel) egresoLabel.innerHTML = `<i data-lucide="arrow-up-right" class="w-4 h-4 stroke-[3]"></i> - Sacar Dinero`;
      if (catContainer) catContainer.classList.remove('hidden');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ================= DEBT & FIXED EXPENSE HANDLERS ================= //

  handleTogglePayment(paidKey, itemName, monto, semanaNum, debtId, categoria) {
    const isNew = this.model.togglePayment(paidKey, itemName, monto, semanaNum, debtId, categoria);
    if (isNew) {
      this.view.launchConfetti();
    }
    this.updateAllUI();
  }

  handleQuickPay(debtId) {
    const currIdx = this.model.getCurrentWeekIndex();
    if (this.model.quickPayDebt(debtId, currIdx)) {
      this.view.launchConfetti();
      this.updateAllUI();
    }
  }

  handleCustomAbono(debtId) {
    const select = document.getElementById('abonoDebtId');
    if (select) select.value = debtId;

    const debt = this.model.getDebtById(debtId);
    const montoInput = document.getElementById('abonoMonto');
    if (montoInput && debt) {
      montoInput.value = debt.mensual || '';
    }

    this.view.openModal('modal-abono-deuda');
  }

  handleSaveAbonoDeuda(e) {
    e.preventDefault();
    const debtId = document.getElementById('abonoDebtId').value;
    const monto = Number(document.getElementById('abonoMonto').value);
    const fecha = document.getElementById('abonoFecha').value;
    const metodo = document.getElementById('abonoMetodo').value;
    const nota = document.getElementById('abonoNota').value;

    const result = this.model.addDebtAbono({
      debtId,
      monto,
      fecha,
      metodo,
      nota
    });

    if (!result.success) {
      alert(result.error || 'Error al registrar abono');
      return;
    }

    this.view.launchConfetti();
    this.view.closeModal('modal-abono-deuda');
    document.getElementById('formAbonoDeuda').reset();
    this.updateAllUI();
  }

  handleSaveDebt(e) {
    e.preventDefault();
    const editId = document.getElementById('debtEditId').value;
    const nombre = document.getElementById('debtNombre').value;
    const acreedor = document.getElementById('debtAcreedor').value;
    const inicial = Number(document.getElementById('debtInicial').value) || 0;
    const mensual = Number(document.getElementById('debtMensual').value) || 0;
    const dia = Number(document.getElementById('debtDia').value) || 15;
    const fin = document.getElementById('debtFin').value;
    const color = document.getElementById('debtColor').value;

    if (editId) {
      this.model.updateDebt(editId, { nombre, acreedor, inicial, mensual, dia, fin, color });
    } else {
      this.model.addDebt({ nombre, acreedor, inicial, mensual, dia, fin, color });
      this.view.launchConfetti();
    }

    this.view.closeModal('modal-deuda');
    document.getElementById('formDeuda').reset();
    document.getElementById('debtEditId').value = '';
    this.updateAllUI();
  }

  handleEditDebt(debtId) {
    const debt = this.model.getDebtById(debtId);
    if (!debt) return;

    document.getElementById('debtEditId').value = debt.id;
    document.getElementById('modalDebtTitle').innerText = `Editar Deuda: ${debt.nombre}`;
    
    const submitBtn = document.getElementById('btnSubmitDebt');
    if (submitBtn) submitBtn.innerText = 'Guardar Cambios';

    const delBtn = document.getElementById('btnDeleteDebtFromModal');
    if (delBtn) delBtn.classList.remove('hidden');

    document.getElementById('debtNombre').value = debt.nombre;
    document.getElementById('debtAcreedor').value = debt.acreedor;
    document.getElementById('debtInicial').value = debt.inicial;
    document.getElementById('debtMensual').value = debt.mensual;
    document.getElementById('debtDia').value = debt.dia;
    document.getElementById('debtFin').value = debt.fin;
    document.getElementById('debtColor').value = debt.color || 'rose';

    this.view.openModal('modal-deuda');
  }

  handleDeleteDebt(debtId) {
    const debt = this.model.getDebtById(debtId);
    if (!debt) return;

    if (confirm(`¿Estás seguro de eliminar la deuda "${debt.nombre}"?`)) {
      this.model.deleteDebt(debtId);
      this.updateAllUI();
    }
  }

  handleSaveFixed(e) {
    e.preventDefault();
    const editId = document.getElementById('fixEditId').value;
    const concepto = document.getElementById('fixConcepto').value;
    const categoria = document.getElementById('fixCategoria').value;
    const monto = Number(document.getElementById('fixMonto').value) || 0;
    const dia = Number(document.getElementById('fixDia').value) || 1;

    if (editId) {
      this.model.updateFixedExpense(editId, { concepto, categoria, monto, dia });
    } else {
      this.model.addFixedExpense({ concepto, categoria, monto, dia });
      this.view.launchConfetti();
    }

    this.view.closeModal('modal-fijo');
    document.getElementById('formFijo').reset();
    document.getElementById('fixEditId').value = '';
    this.updateAllUI();
  }

  handleEditFixed(fixedId) {
    const fixed = this.model.getFixedExpenseById(fixedId);
    if (!fixed) return;

    document.getElementById('fixEditId').value = fixed.id;
    document.getElementById('modalFixedTitle').innerText = `Editar Gasto Fijo: ${fixed.concepto}`;
    
    const submitBtn = document.getElementById('btnSubmitFixed');
    if (submitBtn) submitBtn.innerText = 'Guardar Cambios';

    const delBtn = document.getElementById('btnDeleteFixedFromModal');
    if (delBtn) delBtn.classList.remove('hidden');

    document.getElementById('fixConcepto').value = fixed.concepto;
    document.getElementById('fixCategoria').value = fixed.categoria;
    document.getElementById('fixMonto').value = fixed.monto;
    document.getElementById('fixDia').value = fixed.dia;

    this.view.openModal('modal-fijo');
  }

  handleDeleteFixed(fixedId) {
    const fixed = this.model.getFixedExpenseById(fixedId);
    if (!fixed) return;

    if (confirm(`¿Estás seguro de eliminar el gasto fijo "${fixed.concepto}"?`)) {
      this.model.deleteFixedExpense(fixedId);
      this.updateAllUI();
    }
  }

  // ================= GENERAL TRANSACTIONS HANDLERS ================= //

  handleDeleteTransaction(id) {
    if (confirm('¿Eliminar este movimiento de la bitácora? (Los saldos se recalcularán automáticamente)')) {
      this.model.deleteTransaction(id);
      this.updateAllUI();
    }
  }

  handleSaveTransaction(e) {
    e.preventDefault();
    const tipo = document.querySelector('input[name="txType"]:checked').value;
    const concepto = document.getElementById('txConcepto').value;
    const monto = Number(document.getElementById('txMonto').value);
    const fecha = document.getElementById('txFecha').value;
    const categoria = document.getElementById('txCategoria').value;
    const metodo = document.getElementById('txMetodo').value;
    const cajitaId = document.getElementById('txCajitaId')?.value || null;

    const txDate = new Date(fecha);
    const diffWeeks = Math.floor((txDate - START_DATE) / (7 * 24 * 60 * 60 * 1000)) + 1;
    const semanaNum = Math.min(Math.max(diffWeeks, 1), 52);

    let debtId = null;
    if (categoria === 'Deuda') {
      debtId = document.getElementById('txDebtId')?.value || null;
    }

    this.model.addTransaction({
      id: 'tx-' + Date.now(),
      fecha,
      semanaNum,
      concepto,
      categoria,
      metodo,
      monto,
      tipo,
      debtId,
      cajitaId
    });

    this.view.closeModal('modal-transaccion');
    document.getElementById('formTransaccion').reset();
    document.getElementById('txDebtSelectionContainer')?.classList.add('hidden');
    this.updateAllUI();
  }

  // ================= CAJITAS HANDLERS ================= //

  handleCajitaDeposit(cajitaId) {
    const cajitaSelect = document.getElementById('cmovCajitaId');
    if (cajitaSelect) cajitaSelect.value = cajitaId;
    this.updateCmovModalForSelectedCajita();
    
    const ingresoRadio = document.querySelector('input[name="cmovTipo"][value="INGRESO"]');
    if (ingresoRadio) ingresoRadio.checked = true;

    const montoInput = document.getElementById('cmovMonto');
    if (montoInput) montoInput.value = '';
    
    const conceptoInput = document.getElementById('cmovConcepto');
    if (conceptoInput) conceptoInput.value = '';

    const fechaInput = document.getElementById('cmovFecha');
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];

    this.view.openModal('modal-cajita-movimiento');
  }

  handleCajitaWithdraw(cajitaId) {
    const cajitaSelect = document.getElementById('cmovCajitaId');
    if (cajitaSelect) cajitaSelect.value = cajitaId;
    this.updateCmovModalForSelectedCajita();
    
    const egresoRadio = document.querySelector('input[name="cmovTipo"][value="EGRESO"]');
    if (egresoRadio) egresoRadio.checked = true;

    const montoInput = document.getElementById('cmovMonto');
    if (montoInput) montoInput.value = '';
    
    const conceptoInput = document.getElementById('cmovConcepto');
    if (conceptoInput) conceptoInput.value = '';

    const fechaInput = document.getElementById('cmovFecha');
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];

    this.view.openModal('modal-cajita-movimiento');
  }

  handleCajitaCargo(cajitaId) {
    const cajitaSelect = document.getElementById('cmovCajitaId');
    if (cajitaSelect) cajitaSelect.value = cajitaId;
    this.updateCmovModalForSelectedCajita();
    
    const cargoRadio = document.querySelector('input[name="cmovTipo"][value="INGRESO"]');
    if (cargoRadio) cargoRadio.checked = true;

    const montoInput = document.getElementById('cmovMonto');
    if (montoInput) montoInput.value = '';
    
    const conceptoInput = document.getElementById('cmovConcepto');
    if (conceptoInput) conceptoInput.value = '';

    const fechaInput = document.getElementById('cmovFecha');
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];

    this.view.openModal('modal-cajita-movimiento');
  }

  handleCajitaPago(cajitaId) {
    const cajitaSelect = document.getElementById('cmovCajitaId');
    if (cajitaSelect) cajitaSelect.value = cajitaId;
    this.updateCmovModalForSelectedCajita();
    
    const pagoRadio = document.querySelector('input[name="cmovTipo"][value="EGRESO"]');
    if (pagoRadio) pagoRadio.checked = true;

    const montoInput = document.getElementById('cmovMonto');
    if (montoInput) montoInput.value = '';
    
    const conceptoInput = document.getElementById('cmovConcepto');
    if (conceptoInput) conceptoInput.value = 'Pago mensual de tarjeta';

    const fechaInput = document.getElementById('cmovFecha');
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];

    this.view.openModal('modal-cajita-movimiento');
  }

  handleEditCajita(cajitaId) {
    const cajita = this.model.getCajitaById(cajitaId);
    if (!cajita) return;

    document.getElementById('cajitaEditId').value = cajita.id;
    document.getElementById('modalCajitaTitle').innerText = `Editar: ${cajita.nombre}`;
    
    const submitBtn = document.getElementById('btnSubmitCajita');
    if (submitBtn) submitBtn.innerText = 'Guardar Cambios';

    const delBtn = document.getElementById('btnDeleteCajitaFromModal');
    if (delBtn) delBtn.classList.remove('hidden');

    const nameInput = document.getElementById('cajitaNombre');
    if (nameInput) nameInput.value = cajita.nombre;

    const tipo = cajita.tipoCajita || 'AHORRO';
    const radioTipo = document.querySelector(`input[name="cajitaTipo"][value="${tipo}"]`);
    if (radioTipo) radioTipo.checked = true;
    this.toggleCajitaTipoFields(tipo);

    document.getElementById('cajitaAsignado').value = cajita.asignado;
    document.getElementById('cajitaColor').value = cajita.color || (tipo === 'CREDITO' ? 'purple' : 'emerald');
    document.getElementById('cajitaIcono').value = cajita.icono || (tipo === 'CREDITO' ? 'credit-card' : 'wallet');
    document.getElementById('cajitaMeta').value = cajita.meta || '';
    document.getElementById('cajitaLimiteCredito').value = cajita.limiteCredito || '';
    document.getElementById('cajitaDiaCorte').value = cajita.diaCorte || 12;
    document.getElementById('cajitaDiaPago').value = cajita.diaPago || 2;
    document.getElementById('cajitaDescripcion').value = cajita.descripcion || '';
    
    const saldoCont = document.getElementById('cajitaSaldoInicialContainer');
    if (saldoCont) saldoCont.classList.add('hidden');

    this.view.openModal('modal-cajita');
    if (nameInput) {
      setTimeout(() => {
        nameInput.focus();
        nameInput.select();
      }, 50);
    }
  }

  handleDeleteCajita(cajitaId) {
    const cajita = this.model.getCajitaById(cajitaId);
    if (!cajita) return;

    const tipoStr = cajita.tipoCajita === 'CREDITO' ? 'la tarjeta de crédito' : 'la cajita';
    if (confirm(`¿Estás seguro de eliminar ${tipoStr} "${cajita.nombre}" ($${Number(cajita.saldo).toLocaleString()} saldo) y sus movimientos vinculados?`)) {
      this.model.deleteCajita(cajitaId);
      this.updateAllUI();
    }
  }

  handleDeleteCajitaMovement(movId) {
    if (confirm('¿Eliminar este movimiento? El saldo y la bitácora se actualizarán automáticamente.')) {
      this.model.deleteCajitaMovement(movId);
      this.updateAllUI();
    }
  }

  handleSaveCajita(e) {
    e.preventDefault();
    const editId = document.getElementById('cajitaEditId').value;
    const tipoCajita = document.querySelector('input[name="cajitaTipo"]:checked')?.value || 'AHORRO';
    const nombre = document.getElementById('cajitaNombre').value;
    const asignado = document.getElementById('cajitaAsignado').value;
    const color = document.getElementById('cajitaColor').value;
    const icono = document.getElementById('cajitaIcono').value;
    const meta = Number(document.getElementById('cajitaMeta').value) || 0;
    const limiteCredito = Number(document.getElementById('cajitaLimiteCredito').value) || 0;
    const diaCorte = Number(document.getElementById('cajitaDiaCorte').value) || 1;
    const diaPago = Number(document.getElementById('cajitaDiaPago').value) || 15;
    const descripcion = document.getElementById('cajitaDescripcion').value;

    if (editId) {
      this.model.updateCajita(editId, {
        nombre,
        tipoCajita,
        asignado,
        color,
        icono,
        meta,
        limiteCredito,
        diaCorte,
        diaPago,
        descripcion
      });
    } else {
      const saldoInicial = Number(document.getElementById('cajitaSaldoInicial').value) || 0;
      this.model.addCajita({
        nombre,
        tipoCajita,
        asignado,
        color,
        icono,
        meta,
        limiteCredito,
        diaCorte,
        diaPago,
        descripcion,
        saldoInicial,
        conceptoInicial: tipoCajita === 'CREDITO' ? 'Saldo deudor inicial' : 'Saldo inicial / aportación',
        fechaInicial: new Date().toISOString().split('T')[0]
      });
      this.view.launchConfetti();
    }

    this.view.closeModal('modal-cajita');
    document.getElementById('formCajita').reset();
    document.getElementById('cajitaEditId').value = '';
    this.updateAllUI();
  }

  handleSaveCajitaMovement(e) {
    e.preventDefault();
    const tipo = document.querySelector('input[name="cmovTipo"]:checked').value;
    const cajitaId = document.getElementById('cmovCajitaId').value;
    const monto = Number(document.getElementById('cmovMonto').value);
    const fecha = document.getElementById('cmovFecha').value;
    const concepto = document.getElementById('cmovConcepto').value;
    const categoria = document.getElementById('cmovCategoria')?.value || 'Gustos';

    const result = this.model.addCajitaMovement({
      cajitaId,
      tipo,
      monto,
      concepto,
      fecha,
      categoria,
      syncBitacora: true
    });

    if (!result.success) {
      alert(result.error || 'Error al guardar el movimiento');
      return;
    }

    this.view.launchConfetti();
    this.view.closeModal('modal-cajita-movimiento');
    document.getElementById('formCajitaMovimiento').reset();
    this.updateAllUI();
  }

  handleSaveCajitaTransfer(e) {
    e.preventDefault();
    const fromId = document.getElementById('trFromCajitaId').value;
    const toId = document.getElementById('trToCajitaId').value;
    const monto = Number(document.getElementById('trMonto').value);
    const fecha = document.getElementById('trFecha').value;
    const concepto = document.getElementById('trConcepto').value;

    const result = this.model.transferBetweenCajitas({
      fromId,
      toId,
      monto,
      concepto,
      fecha
    });

    if (!result.success) {
      alert(result.error || 'Error al transferir fondos');
      return;
    }

    this.view.launchConfetti();
    this.view.closeModal('modal-cajita-transferir');
    document.getElementById('formCajitaTransferir').reset();
    this.updateAllUI();
  }

  // ================= BACKUP & IMPORT ================= //

  handleExport() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.model.appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Respaldo_Finanzas_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (this.model.importData(imported)) {
          this.updateAllUI();
          alert('¡Respaldo restaurado con éxito!');
        } else {
          alert('El archivo no tiene el formato correcto.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  }

  handleReset() {
    if (confirm('¿Restaurar todos los valores iniciales del presupuesto? (Se perderá la info actual)')) {
      this.model.resetDefaultData();
      this.updateAllUI();
    }
  }
}
