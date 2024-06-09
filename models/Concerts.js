const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const ConcertsSchema = new Schema({
  title: String,
  date: Date,
  location: String,
  artist: String,
  cover: String,
});


const ConcertsModel = model('Concerts', ConcertsSchema); //name,schema

module.exports = ConcertsModel;