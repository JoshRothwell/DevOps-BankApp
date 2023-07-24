const express = require('express');
const app = express();
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'sql8.freemysqlhosting.net',
  user: 'sql8635000',
  password: '4R82LQKGNc',
  database: 'sql8635000',
});

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route to handle user registration data
app.post('/register', (req, res) => {
  const { name, passcode, balance } = req.body;

  // Perform basic validation (similar to the frontend validation)
  if (!name || !passcode || isNaN(balance) || balance <= 0) {
    return res.status(400).json({ error: 'Please fill in all the fields with valid information.' });
  }

  // Insert the user registration data into the database
  const query = 'INSERT INTO users (name, passcode, balance) VALUES (?, ?, ?)';
  pool.query(query, [name, passcode, balance], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      return res.status(500).json({ error: 'An error occurred while registering the user.' });
    }

    // Success
    return res.status(200).json({ message: 'User registration successful.' });
  });
});

// Start the server
const port = 3000; // You can change this port number if needed
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
