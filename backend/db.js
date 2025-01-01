const mongoose = require('mongoose');

// Define the MongoDB URI
const mongoURI = 'mongodb://127.0.0.1:27017/manager'; // Using 127.0.0.1 instead of localhost to avoid IPv6 issues

// Define the connection function
const connectToMongo = async () => {
    try {
        // Await the connection
        await mongoose.connect(mongoURI, { 
            // Optional: Add options for compatibility with older MongoDB versions
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });

        console.log('Connected to MongoDB successfully!'); // Success message
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message); // Error handling
        process.exit(1); // Exit the process in case of connection failure
    }
};

module.exports = connectToMongo;
