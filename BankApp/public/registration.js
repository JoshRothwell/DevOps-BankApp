// Get references to the form elements for registration
const registrationForm = document.getElementById('registrationForm');
const nameInput = document.getElementById('name');
const passcodeInput = document.getElementById('passcode');
const pincodeInput = document.getElementById('pincode');
const balanceInput = document.getElementById('balance');
const messageBox = document.getElementById('message-box');

// Event listener for form submission
registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get the form values
  const name = nameInput.value;
  const passcode = passcodeInput.value;
  const pincode = pincodeInput.value;
  const balance = parseFloat(balanceInput.value);

  // Perform basic validation
  if (!name || !passcode || !pincode || isNaN(balance) || balance <= 0) {
    showMessage('Please fill in all the fields with valid information.', 'error');
    return;
  }

  try {
    // Send user registration data to the server
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, passcode, balance, pincode }),
    });

    // Parse the response
    const data = await response.json();

    if (response.ok) {
      // Registration successful
      showMessage(data.message, 'success');
      // Clear the form fields
      registrationForm.reset();
    } else {
      // Registration failed
      showMessage(data.error, 'error');
    }
  } catch (error) {
    showMessage('An error occurred. Please try again.', 'error');
    console.error('Error:', error);
  }
});

// Function to display messages
function showMessage(message, type) {
  messageBox.textContent = message;
  messageBox.classList.remove('error', 'success');
  messageBox.classList.add(type);
}
