// index.js
const BASE_URL = 'http://localhost:3000';

const fetchUsers = {
  async get(endpoint) {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error fetching data from ${endpoint}`);
    }
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error posting data to ${endpoint}`);
    }
    return response.json();
  },

  async delete(endpoint, id) {
    const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error deleting data from ${endpoint}`);
    }
    return response.json();
  },
};

export default fetchUsers;

const settingsIcon = document.querySelector('.settings');
const settingsModal = document.querySelector('.settings-modal');

settingsIcon.addEventListener('click', () => {
  // Show settings modal
  settingsModal.classList.toggle('hidden');
});

// Your data
const data = await fetchUsers.get('employees');

// Update gender counts
const maleCountElement = document.getElementById('maleCount');
const femaleCountElement = document.getElementById('femaleCount');
const maleCount = data.filter((user) => user.gender === 'male').length;
const femaleCount = data.filter((user) => user.gender === 'female').length;
maleCountElement.textContent = maleCount;
femaleCountElement.textContent = femaleCount;

// Update department counts
const accountingCountElement = document.getElementById('accountingCount');
const marketingCountElement = document.getElementById('marketingCount');
const ITCountElement = document.getElementById('ITCount');
const accountingCount = data.filter(
  (user) => user.department === 'accounting'
).length;
const marketingCount = data.filter(
  (user) => user.department === 'marketing'
).length;
const ITCount = data.filter((user) => user.department === 'IT').length;
accountingCountElement.textContent = accountingCount;
marketingCountElement.textContent = marketingCount;
ITCountElement.textContent = ITCount;

const departments = data.map((employee) => employee.department);
const departmentCounts = {};

departments.forEach((department) => {
  departmentCounts[department] = (departmentCounts[department] || 0) + 1;
});

const ctx = document.getElementById('departmentChart').getContext('2d');
const departmentChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        label: 'Employee Counts by Department',
        data: Object.values(departmentCounts),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderColor: 'rgba(0, 0, 0, 0.7)',
        borderWidth: 4,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Create a pie chart

const gender = document.getElementById('genderChart').getContext('2d');
const genderChart = new Chart(gender, {
  type: 'pie',
  data: {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ['#444', '#888'],
      },
    ],
  },
});
