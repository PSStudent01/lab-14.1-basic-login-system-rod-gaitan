// Entry POint:

require('dotenv').config();  // imports the '.env' file so that all 3 env variables are accessible throughout the app. 
                            // this must always be the 1st  line so everything else can use those values.
const express = require('express'); //Imports the Express library to be able to build the web server
const connectDB = require('./config/connection'); // Imports the database connection function that will be written in the 'config/connection.js'
const userRoutes = require('./routes/userRoutes'); // Imports the router we'll write later for /register and /login.

const app = express(); // this creates your actual 'Express application instance' ('app'). 'app' is sorta a server object.

// Connect to MongoDB
connectDB(); // this calls 'connectDB' function which is reponsible for connecting to 'MongoDB Atlas' using the 'MONGO_URI'.

// Middleware
app.use(express.json()); // this tells 'Express' to automatically parse incoming JSON request bodies. Without this, req.body would be undefined.
                         /* server receives data from a client in JSON format, this reads that data and converts it into a format (JS) this app program can work with.*/

// Routes
app.use('/api/users', userRoutes); // this tells Express that any request starting with '/api/users' should be handled by your 'user routes' file.

const PORT = process.env.PORT || 3001; //Grabs the port from .env but if such port is not available, it uses 3001 as an alternative 
app.listen(PORT, () => {  // this starts the server and listens for incoming requests. The callback fires....
  console.log(`Server running on port ${PORT}`); //...to display a message once it's successfully running.
});