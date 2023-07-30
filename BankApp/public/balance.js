// Get the username from the query parameter
function getUsernameFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('username');
  }
  
  // Function to fetch the user's balance from the database
  async function fetchBalance() {
    const username = getUsernameFromQuery();
    if (username) {
      try {
        const response = await fetch(`/balance/${username}`);
        const data = await response.json();
  
        if (response.ok) {
          // Display the balance message
          const balanceMessage = document.getElementById('balanceMessage');
          balanceMessage.textContent = `Your account balance is $${data.balance.toFixed(2)}`;
        } else {
          // Display error message if balance retrieval fails
          const balanceMessage = document.getElementById('balanceMessage');
          balanceMessage.textContent = 'An error occurred while fetching your balance.';
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  }
  
  // Call the function to fetch and display the balance
  fetchBalance();
  