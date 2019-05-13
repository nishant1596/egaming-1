const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const competitionSchema = new Schema({
  competition_title:{
    type:String,
    required:true
  },
  competition_detail:{
    type:String,
    required:true
  },
  competition_date:{
    type:Date,
    required:true
  },

    competition_country:{
      type:String,
      required:true
    },
    competition_state:{
      type:String,
      required:true
    },
    competition_city:{
      type:String,
      required:true
    },
  competition_name:{
    type:String,
    required:true
  },
  competition_price:{
    type:String,
    required:true
  },
  competition_type:{
    type:String,
    required:true
  },
  competition_isPremium:{
    type:String
  },
  competition_duration:{
    type:Number,
    required:true
  },

  competition_image:{
    type:String
  },
  competition_post_publish_date:{
    type:Date,
    default:Date.now
  },

  competition_address:{
    type:String,
    required:true
  }
});
mongoose.model('competitionModel',competitionSchema);
