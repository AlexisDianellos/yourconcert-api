
const mongoose = require('mongoose');//mongoose to conncet with db
const {Schema, model} = mongoose;

const PostSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  performanceQuality: String,
  pqComments: String,
  stagePresence: String,
  spComments: String,
  soundQuality: String,
  sqComments: String,
  visualEffects: String,
  veComments: String,
  audienceInteraction: String,
  aiComments: String,
  author: {type:Schema.Types.ObjectId, ref:'User'},
},{
  timestamps:true,
});

const PostModel = model('Post', PostSchema); //name,schema

module.exports = PostModel;