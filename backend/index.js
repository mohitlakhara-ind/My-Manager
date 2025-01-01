const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');

// Connect to MongoDB
connectToMongo();

const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000

// Middleware
app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/budget', require('./routes/budget'));

// Start Server
app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`);
});

// Graceful Error Handling
process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1); // Exit the process to avoid unknown behavior
});
