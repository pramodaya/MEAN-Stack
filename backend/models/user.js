const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  userType: { type: String, required: true },
  userPost: { type: [String] , default: null }
});

// check unique or not, used above library
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);
