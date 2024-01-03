const settingsIcon = document.querySelector('.settings');
const settingsModal = document.querySelector('.settingsContent');

console.log(settingsIcon);

settingsIcon.addEventListener('click', () => {
  // Show settings modal
  settingsModal.classList.toggle('active');
});
