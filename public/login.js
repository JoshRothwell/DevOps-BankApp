// login.js

// Get references to the form elements for login
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passcodeInput = document.getElementById('passcode');
const messageBox = document.getElementById('message-box');

// Event listener for login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get the form values
  const username = usernameInput.value;
  const passcode = passcodeInput.value;

  // Perform basic validation
  if (!username || !passcode) {
    showMessage('Please fill in all the fields.', 'error');
    return;
  }

  try {
    // Send user login data to the server
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, passcode }),
    });

    // Parse the response
    const data = await response.json();

    // ...
if (response.ok) {
  // Login successful
  showMessage('Login successful!', 'success');
  // Redirect to the welcome page with the username as a query parameter
  window.location.href = `/welcome.html?username=${username}`;
} else {
  // Login failed
  showMessage(data.error, 'error');
}
// ...

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
