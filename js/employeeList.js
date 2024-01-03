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

  // Add PUT method to the fetchUsers object
  async put(endpoint, id, data) {
    const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error updating data at ${endpoint}`);
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

// Call the displayDeletedUserName function within the fetchDataAndRender function
async function fetchDataAndRender() {
  try {
    // Show loader while fetching data
    loader.style.display = 'block';

    // Add a delay of 500 ms
    await new Promise((resolve) => setTimeout(resolve, 500));

    data = await fetchUsers.get('employees', queryBuilder());
    paginationControls.style.display = data.length > 10 ? '' : 'none';
    generateEmployeeList(data);

    // Display the deleted user's name
    displayDeletedUserName();
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

  let html = '';

  if (employees.length === 0) {
    html = `<td colspan="6" class="text-center h-32">
      <h2 class="text-2xl text-gray-500">No candidates found</h2>
    </td>`;

    employeeList.innerHTML = html;
  } else {
    const html = paginatedData
      .map(
        (employee) => `
    <tr>
      <td class="px-4 py-2 whitespace-nowrap">${employee.fullName}</td>
      <td class="px-4 py-2 whitespace-nowrap">${employee.department}</td>
      <td class="px-4 py-2 whitespace-nowrap">${employee.position}</td>
      <td class="px-4 py-2 whitespace-nowrap">${employee.gender}</td>
      <td class="px-4 py-2 whitespace-nowrap">${employee.dateOfBirth}</td>
      <td class="px-4 py-2 whitespace-nowrap flex items-center justify-center">
        <button 
          onclick="editUser(${employee.id})"
          class="w-full bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-md duration-200"
        >View</button>
      </td>
    </tr>
  `
      )
      .join('');
    employeeList.innerHTML = html;
  }

  // Add pagination controls
  addPaginationControls(employees);
}
let user = null;
function editUser(id) {
  console.log(id);
  user = data.find((user) => user.id === id);

  console.log(user);

  openModal(user);
}
window.editUser = editUser;

function openModal(user) {
  // Assuming you have an editModal element
  const editModal = document.querySelector('#editModal');

  // Use the user data to populate the modal fields (replace these with actual field IDs)
  document.getElementById('fullName').value = user.fullName;
  document.getElementById('position').value = user.position;
  // Set department radio button
  document.querySelector(
    `input[name="edit-department"][value="${user.department}"]`
  ).checked = true;
  // Set gender radio button
  document.querySelector(
    `input[name="edit-gender"][value="${user.gender}"]`
  ).checked = true;
  // Set dateOfBirth
  document.getElementById('dateOfBirth').value = user.dateOfBirth;

  // Remove 'hidden' class to show the modal
  editModal.classList.remove('hidden');
  editModal.classList.add('flex');
}
const addEmployeeButton = document.querySelector('#addEmployeeButton');

addEmployeeButton.addEventListener('click', (e) => {
  e.preventDefault();

  saveChanges();
});
// Function to save changes
function saveChanges() {
  // Get updated values from modal fields
  const updatedFullName = document.getElementById('fullName').value;
  const updatedPosition = document.getElementById('position').value;
  const updatedDepartment = document.querySelector(
    'input[name="edit-department"]:checked'
  ).value;
  const updatedGender = document.querySelector(
    'input[name="edit-gender"]:checked'
  ).value;
  const updatedDateOfBirth = document.getElementById('dateOfBirth').value;

  // Update the user data (replace this with actual data structure)
  const updatedUser = {
    id: user.id,
    fullName: updatedFullName,
    position: updatedPosition,
    department: updatedDepartment,
    gender: updatedGender,
    dateOfBirth: updatedDateOfBirth,
  };

  try {
    fetchUsers.put('employees', user.id, updatedUser);

    updateUserData(updatedUser);

    closeEditModal();
  } catch (error) {
    console.error('Error updating user:', error.message);
  }

  closeEditModal();
}

document.body.addEventListener('click', (e) => {
  if (e.target.id === 'editModal') {
    closeEditModal();
    user = null;
  }
});
// Function to close the modal
function closeEditModal() {
  const editModal = document.querySelector('#editModal');
  user = null;
  editModal.classList.add('hidden');
  editModal.classList.remove('flex');
}

// Assuming you have a function to update the user data in your array
function updateUserData(updatedUser) {
  console.log(updatedUser);
  // Find the user in the data array and update the values
  const userIndex = data.findIndex((user) => user.id === updatedUser.id);
  if (userIndex !== -1) {
    data[userIndex] = { ...data[userIndex], ...updatedUser };

    console.log('User updated:', data[userIndex]);
  } else {
    console.error('User not found for updating.');
  }
}

const deleteUserButton = document.querySelector('#deleteUserButton');

deleteUserButton.addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent the default behavior

  try {
    console.log(user.id);
    await fetchUsers.delete('employees', user.id);
    updateDataAfterDelete(user);
    closeEditModal();
  } catch (error) {
    console.error('Error deleting user:', error.message);
  }
});

const deletedUserNameElement = document.querySelector('#deletedUserName');
let deletedUserName = null;

// Load the deleted user's information from localStorage when the page loads
deletedUserName = localStorage.getItem('deletedUserName');

// Display the deleted user's name if available
displayDeletedUserName();

setTimeout(() => {
  localStorage.removeItem('deletedUserName'); // Clear the stored name
}, 2000);

function updateDataAfterDelete(deletedUser) {
  // Find the index of the user in the data array
  const userIndex = data.findIndex((user) => user.id === deletedUser.id);
  if (userIndex !== -1) {
    // Store the deleted user's name in localStorage
    deletedUserName = data[userIndex].fullName;
    localStorage.setItem('deletedUserName', deletedUserName);

    // Remove the user from the data array
    data.splice(userIndex, 1);
    console.log('User deleted:', deletedUser);

    // Display the deleted user's name on the page for 1000ms
    setTimeout(() => {
      deletedUserName = null;
    }, 2500);
  } else {
    console.error('User not found for deletion in data array.');
  }
}

// Add a function to display the deleted user's name
function displayDeletedUserName() {
  if (deletedUserName) {
    deletedUserNameElement.textContent = `Candidate "${deletedUserName}" deleted`;
    deletedUserNameElement.classList.remove('hidden');
    // Remove the message after 1000ms
    setTimeout(() => {
      deletedUserNameElement.textContent = '';
      deletedUserNameElement.classList.add('hidden');
    }, 2500);
  }
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
