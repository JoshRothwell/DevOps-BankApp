// Function to extract the username from the query parameter
function getUsernameFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('username');
  }
  
  // Function to display the debug message with the username
  function displayDebugMessage() {
    const username = getUsernameFromQuery();
    if (username) {
      console.log(`Debug: Currently tracking user - ${username}`);
    } else {
      console.log('Debug: No user information found in the query parameter.');
    }
  }
  
  // Call the function to display the debug message
  displayDebugMessage();
  