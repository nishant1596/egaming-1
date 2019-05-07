const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const seminarSchema = new Schema({
  seminar_title:{
    type:String,
    required:true
  },
  seminar_detail:{
    type:String,
    required:true
  },
  seminar_date:{
    type:Date,
    required:true
  },
  seminar_city:{
    type:String,
    required:true
  },
  seminar_gamename:{
    type:String,
    required:true
  },
  seminar_price:{
    type:String,
    required:true
  },
  seminar_gametype:{
    type:String,
    required:true
  },
  seminar_image:{
    type:String,
    required:true
  },
  seminar_post_publish_date:{
    type:Date,
    default:Date.now
  },

  seminar_address:{
    type:String,
    required:true
  }
});
mongoose.model('seminarModel',seminarSchema);
