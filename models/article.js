const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const articleSchema = new Schema({
  article_title:{
    type:String,
    required:true
  },
  article_detail:{
    type:String,
    required:true
  },

  article_tags:{
    type:String
  },
  article_mustRead:{
    type:String
  },


  article_image:{
    type:String
  },
  article_date_pub:{
    type:Date,
    default:Date.now
  },

});
mongoose.model('articleModel',articleSchema);
