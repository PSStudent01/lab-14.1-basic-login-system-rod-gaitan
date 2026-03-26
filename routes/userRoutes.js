// User Routes:

const express = require('express'); //Imports the Express library to be able to create router
const router = express.Router(); // this creates a 'router object'
                                //  it's much like a mini version of 'app' that handles a specific group of routes. 
                                // This is what we export and mount in 'server.js' at /api/users.
const jwt = require('jsonwebtoken'); // this thing imports the 'jsonwebtoken' library to create and sign 'JWTs' during login.
const User = require('../models/User'); // this imports our User model so we can query and create users in the database.

// POST /api/users/register
router.post('/register', async (req, res) => { //Defines a POST route at /register. 
                                                // Since this router is mounted at '/api/users' in 'server.js', the full path becomes /api/users/register. 
  try { // try to attempt this code, but if somthing goes technically wrong, jump to 'catch' to throw the proper error and don't crash"
    const { username, email, password } = req.body; // this destructures the 3  fields we need out of the 'request body' that the user sends in their POST request body.

    const existingUser = await User.findOne({ email }); // this searches the database for a user with the  email in question. 
                                                        // THEN it returns the user document if found, OR null IF not.
    if (existingUser) { // IF a user was found, it stops here and ...
      return res.status(400).json({ message: 'User with that email already exists' }); //...returns a 400 (bad request) error. The return stops executing the rest of the function.
    }

    const newUser = await User.create({ username, email, password }); // this creates and saves a new user document in the database. 
                                                                        // it also triggers the 'pre-save' hook in our model which automatically hashes the password before saving.
    const userToReturn = newUser.toObject(); // this converts the 'Mongoose document' into a 'plain JavaScript object' so we can manipulate it.
    delete userToReturn.password; // this removes the password from the object before sending it back. 
                                // this is bc you'd never want to return a password, even a hashed one, in a response.

    res.status(201).json(userToReturn);  // this returns a 201 (created) status with the new user's data as JSON.
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const isMatch = await user.isCorrectPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { _id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;