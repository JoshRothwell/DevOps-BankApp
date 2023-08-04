// Dependencies
const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');

// SQL Database crededentials
const pool = mysql.createPool({
  host: 'sql8.freemysqlhosting.net',
  user: 'sql8636523',
  password: 'IxSanycVlC',
  database: 'sql8636523',
});

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle user registration data
app.post('/register', (req, res) => {
  const { name, passcode, balance, pincode } = req.body;

  // Perform basic validation
  if (!name || !passcode || !pincode || isNaN(balance) || balance <= 0) {
    return res.status(400).json({ error: 'Please fill in all the fields with valid information.' });
  }

  // Insert the user registration data into the database
  const query = 'INSERT INTO users (name, passcode, balance, pincode) VALUES (?, ?, ?, ?)';
  pool.query(query, [name, passcode, balance, pincode], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      return res.status(500).json({ error: 'An error occurred while registering the user.' });
    }

    // Success
    console.log('User registration successful:', result);
    return res.status(200).json({ message: 'User registration successful.' });
  });
});

// Route to handle user login data
app.post('/login', (req, res) => {
  const { username, passcode } = req.body;

  // Perform basic validation
  if (!username || !passcode) {
    return res.status(400).json({ error: 'Please provide a username and passcode.' });
  }

  // Check if the user exists in the database
  const query = 'SELECT * FROM users WHERE name = ? AND passcode = ?';
  pool.query(query, [username, passcode], (err, result) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'An error occurred while trying to login.' });
    }

    if (result.length === 0) {
      // User not found or incorrect credentials
      return res.status(401).json({ error: 'Invalid username or passcode.' });
    }

    // Success - User found
    return res.status(200).json({ message: 'Login successful.' });
  });
});

// Route to fetch the user's balance
app.get('/balance/:username', (req, res) => {
  const username = req.params.username;

  // Check if the username is provided
  if (!username) {
    return res.status(400).json({ error: 'Username is required to fetch the balance.' });
  }

  // Query the database to get the user's balance
  const query = 'SELECT balance FROM users WHERE name = ?';
  pool.query(query, [username], (err, result) => {
    if (err) {
      console.error('Error fetching balance from the database:', err);
      return res.status(500).json({ error: 'An error occurred while fetching the balance.' });
    }

    // Check if the user exists
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Return the user's balance
    const balance = result[0].balance;
    return res.status(200).json({ balance });
  });
});

// Route to handle deposit request
app.post('/deposit/:username', (req, res) => {
  const username = req.params.username;
  const depositAmount = req.body.amount;

  // Check if the username and deposit amount are provided
  if (!username || isNaN(depositAmount) || depositAmount <= 0) {
    return res.status(400).json({ error: 'Please provide a valid username and deposit amount.' });
  }

  // Query the database to get the user's current balance
  const getBalanceQuery = 'SELECT balance FROM users WHERE name = ?';
  pool.query(getBalanceQuery, [username], (err, result) => {
    if (err) {
      console.error('Error fetching balance from the database:', err);
      return res.status(500).json({ error: 'An error occurred while fetching the balance.' });
    }

    // Check if the user exists
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Get the user's current balance
    const currentBalance = result[0].balance;

    // Calculate the new balance after deposit
    const newBalance = currentBalance + depositAmount;

    // Update the user's balance in the database
    const updateBalanceQuery = 'UPDATE users SET balance = ? WHERE name = ?';
    pool.query(updateBalanceQuery, [newBalance, username], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating balance in the database:', updateErr);
        return res.status(500).json({ error: 'An error occurred while updating the balance.' });
      }

      // Success - Balance updated
      return res.status(200).json({ message: 'Deposit successful.', newBalance });
    });
  });
});

// Route to handle withdraw request
app.post('/withdraw/:username', (req, res) => {
  const username = req.params.username;
  const withdrawAmount = req.body.amount;

  // Check if the username and withdraw amount are provided
  if (!username || isNaN(withdrawAmount) || withdrawAmount <= 0) {
    return res.status(400).json({ error: 'Please provide a valid username and withdraw amount.' });
  }

  // Query the database to get the user's current balance
  const getBalanceQuery = 'SELECT balance FROM users WHERE name = ?';
  pool.query(getBalanceQuery, [username], (err, result) => {
    if (err) {
      console.error('Error fetching balance from the database:', err);
      return res.status(500).json({ error: 'An error occurred while fetching the balance.' });
    }

    // Check if the user exists
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Get the user's current balance
    const currentBalance = result[0].balance;

    // Check if the withdrawal amount is greater than the current balance
    if (withdrawAmount > currentBalance) {
      return res.status(400).json({ error: 'Insufficient balance for withdrawal.' });
    }

    // Calculate the new balance after withdrawal
    const newBalance = currentBalance - withdrawAmount;

    // Update the user's balance in the database
    const updateBalanceQuery = 'UPDATE users SET balance = ? WHERE name = ?';
    pool.query(updateBalanceQuery, [newBalance, username], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating balance in the database:', updateErr);
        return res.status(500).json({ error: 'An error occurred while updating the balance.' });
      }

      // Success - Balance updated
      return res.status(200).json({ message: 'Withdraw successful.', newBalance });
    });
  });
});

// Start the server
const port = 3000; // You can change this port number if needed
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Export the Express app
module.exports = app;
