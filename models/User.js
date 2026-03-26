
// User Schema:

const mongoose = require('mongoose'); // Imports 'mongoose' for the file to use to create the User schema
const bcrypt = require('bcrypt');  // Imports bcrypt, which is the library that handles password hashing

const userSchema = new mongoose.Schema({ // creates a new schema/blueprint for the user that defines the shape of each document in MongoDB.
                                        // document shape for 'user' field. Here, for the 'user' document...  
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true }); // This 2nd argument closes of the schema definition
                          // - 'timestamps:' when set to true, it tells Mongoose to automatically add 2 fields to every document:
                          // -- 'createdAt'
                          // -- 'updatedAt'

// Pre-save hook to hash password
userSchema.pre('save', async function(next) { // this registers a pre-save hook, a function that automatically runs before any user document is saved to the database. 
                                                // 'next' is a callback that you call when function finishes running to continue the save process.
  if (!this.isModified('password')) return next(); // this checks if the password field was changed. IF it wasn't, THEN it skips the hashing process and moves on. 
                                                // Therefore, it prevents re-hashing an already hashed password if you update something else on the user object later.

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check password
userSchema.methods.isCorrectPassword = async function(incomingPassword) {
  return await bcrypt.compare(incomingPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;