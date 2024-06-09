//The UserModel defines the structure of user data within your application. The schema (UserSchema) specifies that each user must have a username and password w additional constraints

const mongoose = require('mongoose');//mongoose to conncet with db
const {Schema, model} = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, minlength: 4, unique: true },
  password: { type: String, required: true },
});


const UserModel = model('User', UserSchema); //name,schema

module.exports = UserModel;