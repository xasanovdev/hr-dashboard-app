function validateDateOfBirth(input) {
  const dateOfBirth = new Date(input + 'T00:00:00');
  const currentDate = new Date();
  const minDate = new Date(1900, 0, 1);

  return (
    !isNaN(dateOfBirth.getTime()) &&
    dateOfBirth >= minDate &&
    dateOfBirth < currentDate
  );
}

function validateRadioButtons(radioGroupName) {
  const radioButtons = document.querySelectorAll(
    `input[name="${radioGroupName}"]:checked`
  );
  return radioButtons.length > 0;
}

function validateInput(inputId) {
  const inputValue = document.getElementById(inputId).value;
  return inputValue.trim() !== '';
}

const addEmployeeButton = document.getElementById('addEmployeeButton');

addEmployeeButton.addEventListener('click', createNewEmployee);

async function createNewEmployee(e) {
  e.preventDefault();

  // Validate all inputs and radio buttons
  const isValidFullName = validateInput('fullName');
  const isValidPosition = validateInput('position');
  const isValidDepartment = validateRadioButtons('department');
  const isValidGender = validateRadioButtons('gender');
  const isValidDateOfBirth = validateDateOfBirth(
    document.getElementById('dateOfBirth').value
  );
  const errorMessages = document.querySelector('.errorMessage');
  if (
    !isValidFullName ||
    !isValidPosition ||
    !isValidDepartment ||
    !isValidGender ||
    !isValidDateOfBirth
  ) {
    // Display an error message or handle validation failure
    errorMessages.classList.remove('hidden');
    console.error('Validation failed');
    return;
  } else {
    errorMessages.classList.add('hidden');
  }

  // Collect values from form fields
  const fullName = document.getElementById('fullName').value;
  const position = document.getElementById('position').value;
  const department = document.querySelector(
    'input[name="department"]:checked'
  ).value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const dateOfBirth = document.getElementById('dateOfBirth').value;

  // Create an object with the collected values
  const newEmployee = {
    fullName,
    position,
    department,
    gender,
    dateOfBirth,
  };
  console.log(newEmployee);

  try {
    // Send a POST request to your JSON server
    const response = await fetch('http://localhost:3000/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmployee),
    });

    if (!response.ok) {
      throw new Error(`Error creating new employee: ${response.statusText}`);
    }

    // Reset form fields after successful creation
    document.getElementById('fullName').value = '';
    document.getElementById('position').value = '';
    document.getElementById('accounting').checked = true;
    document.getElementById('male').checked = true;
    document.getElementById('dateOfBirth').value = '';

    // Optionally, you can fetch and render the updated employee list here
  } catch (error) {
    console.error('Error:', error);
  }
}
