// import { fetchUsers } from '../utils/utils.js';
// index.js
const BASE_URL = 'http://localhost:3000';

const fetchUsers = {
  async get(endpoint, queryParams) {
    const queryString = queryParams ? `?${queryParams}` : '';
    const response = await fetch(`${BASE_URL}/${endpoint}${queryString}`);
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

const checkboxes = document.querySelectorAll('.filter-checkbox');
const employeeList = document.querySelector('#employeeList');
const paginationControls = document.querySelector('#paginationControls');
const searchCandidates = document.querySelector('#searchCandidate');
const searchCandidateButton = document.querySelector('#searchCandidateButton');

searchCandidateButton.addEventListener('click', async () => {
  const searchQuery = searchCandidates.value;
  const data = await fetchUsers.get('employees', `q=${searchQuery}`);

  window.history.pushState({ path: searchQuery }, '', searchQuery);

  generateEmployeeList(data);
});

const checkedDepartment = [];
const checkedGender = [];
let currentPage = 1;
const itemsPerPage = 10; // Adjust as needed

function queryBuilder() {
  const departmentQuery =
    checkedDepartment.length > 0
      ? `department=${checkedDepartment.join(',')}`
      : '';
  const genderQuery =
    checkedGender.length > 0 ? `gender=${checkedGender.join(',')}` : '';
  const paginationQuery = `page=${currentPage}&limit=${itemsPerPage}`;
  const newUrl = `${window.location.pathname}?${[
    departmentQuery,
    genderQuery,
    paginationQuery,
  ]
    .filter(Boolean)
    .join('&')}`;

  
  window.history.pushState({ path: newUrl }, '', newUrl);

  return [departmentQuery, genderQuery, paginationQuery]
    .filter(Boolean)
    .join('&');
}
let data = null;

const loader = document.querySelector('#loader');

async function fetchDataAndRender() {
  try {
    // Show loader while fetching data
    loader.style.display = 'block';

    // Add a delay of 500 ms
    await new Promise((resolve) => setTimeout(resolve, 500));

    data = await fetchUsers.get('employees', queryBuilder());
    paginationControls.style.display = data.length > 10 ? '' : 'none';
    generateEmployeeList(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // Hide loader after fetching data
    loader.style.display = 'none';
  }
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', function () {
    if (this.getAttribute('name') === 'department') {
      if (this.checked) {
        checkedDepartment.push(this.value);
      } else {
        const index = checkedDepartment.indexOf(this.value);
        if (index !== -1) {
          checkedDepartment.splice(index, 1);
        }
      }
    } else {
      if (this.checked) {
        checkedGender.push(this.value);
      } else {
        const index = checkedGender.indexOf(this.value);
        if (index !== -1) {
          checkedGender.splice(index, 1);
        }
      }
    }

    currentPage = 1; // Reset to the first page when filters change
    fetchDataAndRender();
  });
});

function generateEmployeeList(employees) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = employees.slice(startIndex, endIndex);

  const html = paginatedData
    .map(
      (employee) => `
    <tr onclick="console.log('click =${employee.id}')" class="hover:bg-zinc-200 active:bg-zinc-300 duration-200 cursor-pointer">
      <td class="px-4 py-2 whitespace-nowrap">${employee.fullName}</td>
      <td class="px-4 py-2 whitespace-nowrap">${employee.department}</td>
      <td class="px-4 py-2 whitespace-nowrap">${employee.position}</td>
      <td class="px-4 py-2 whitespace-nowrap">${employee.gender}</td>
      <td class="px-4 py-2 whitespace-nowrap">${employee.dateOfBirth}</td>
    </tr>
  `
    )
    .join('');

  employeeList.innerHTML = html;

  // Add pagination controls
  addPaginationControls(employees);
}

function addPaginationControls(employees) {
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const pageButtonsContainer = document.querySelector('#pageButtons');
  pageButtonsContainer.innerHTML = '';

  for (let page = 1; page <= totalPages; page++) {
    const button = document.createElement('button');
    button.classList.add(
      'bg-white',
      'hover:bg-zinc-200',
      'text-black',
      'px-4',
      'py-2',
      'rounded-md',
      'duration-200'
    );
    button.textContent = page;

    if (page === currentPage) {
      button.classList.remove('bg-white', 'text-black');
      button.classList.add('bg-black', 'text-white');
    } else {
      button.classList.add('bg-white', 'text-black');

      button.classList.remove('bg-black', 'text-white');
    }

    button.onclick = () => goToPage(page);
    pageButtonsContainer.appendChild(button);
  }
}

function goToPage(page) {
  currentPage = page;
  fetchDataAndRender();
}

function nextPage() {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    console.log(currentPage);
    fetchDataAndRender();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    console.log(currentPage);
    fetchDataAndRender();
  }
}

// Attach these functions to the window object
window.nextPage = nextPage;
window.prevPage = prevPage;

// Initial fetch and render
fetchDataAndRender();
