const settingsIcon = document.querySelector('.settings');
const settingsModal = document.querySelector('.settings-modal');

settingsIcon.addEventListener('click', () => {
  // Show settings modal
  settingsModal.classList.toggle('hidden');
});

// Your data
const maleCount = 30;
const femaleCount = 50;

// Create a pie chart

const gender = document.getElementById('genderChart').getContext('2d');
const genderChart = new Chart(gender, {
  type: 'pie',
  data: {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ['#E21A1A', '#509ADB'],
      },
    ],
  },
});

// Your data
const accounting = 30;
const IT = 50;
const marketing = 50;
const departments = document
  .getElementById('departmentsChart')
  .getContext('2d');
const departmentsChart = new Chart(departments, {
  type: 'pie',
  data: {
    labels: ['Accounting', 'IT', 'Marketing'],
    datasets: [
      {
        data: [accounting, IT, marketing],
        backgroundColor: ['#9228aa', 'yellow', '#2ecc71'],
      },
    ],
  },
});

