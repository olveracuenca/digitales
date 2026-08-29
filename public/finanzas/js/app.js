document.addEventListener('DOMContentLoaded', async () => {
  // Initialize the MVC Application
  window.appController = new Controller();
  await window.appController.init();
});
