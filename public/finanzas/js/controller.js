class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.bindEvents();
    this.updateAllUI();
  }

  updateAllUI() {
    const weeks = this.model.generate52Weeks();
    const currIdx = this.model.getCurrentWeekIndex();
    const currWeek = weeks[currIdx];

    this.view.updateHero(currWeek, this.model.appState);
    this.view.renderCharts(this.model.appState);
    this.view.renderWeeks(weeks, currIdx, this.model.appState, this.handleTogglePayment.bind(this));
    this.view.renderDebts(this.model.appState, this.handleQuickPay.bind(this));
    this.view.renderFixedExpenses(this.model.appState);
    this.view.renderTransactions(this.model.appState, this.handleDeleteTransaction.bind(this));
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
        if(tabId) this.view.switchTab(tabId);
      });
    });

    // Modals
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.view.openModal(e.currentTarget.dataset.openModal);
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.view.closeModal(e.currentTarget.dataset.closeModal);
      });
    });

    // Form
    const txForm = document.getElementById('formTransaccion');
    if (txForm) {
      txForm.addEventListener('submit', (e) => this.handleSaveTransaction(e));
    }

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

  handleTogglePayment(paidKey, itemName, monto, semanaNum, debtId) {
    const isNew = this.model.togglePayment(paidKey, itemName, monto, semanaNum, debtId);
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

  handleDeleteTransaction(id) {
    if (confirm('¿Eliminar este movimiento de la bitácora?')) {
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

    const txDate = new Date(fecha);
    const diffWeeks = Math.floor((txDate - START_DATE) / (7 * 24 * 60 * 60 * 1000)) + 1;
    const semanaNum = Math.min(Math.max(diffWeeks, 1), 52);

    this.model.addTransaction({
      id: 'tx-' + Date.now(),
      fecha,
      semanaNum,
      concepto,
      categoria,
      metodo,
      monto,
      tipo
    });

    this.view.closeModal('modal-transaccion');
    document.getElementById('formTransaccion').reset();
    this.updateAllUI();
  }

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
