require('dotenv').config();  // imports the '.env' file so that all 3 env variables are accessible throughout the app. 
                            // this must always be the 1st  line so everything else can use those values.
const express = require('express'); //Imports the Express library so we can create a web server.
const connectDB = require('./config/connection');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});