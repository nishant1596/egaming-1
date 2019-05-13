const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const courseDetail = new Schema({
  //   course_id:{
  //   type:String,
  //   default:mongoose.Types.ObjectId()
  // },
  course_name:{
    type:String,
  },
  course_duration:{
    type:Number
  },
  course_detail:{
    type:String
  },
  course_price:{
    type:Number
  },
  course_seats:{
    type:Number
  },
  course_has_offer:{
    type:String
  },
  course_has_offer_text:{
    type:String
  }
});


var coachingSchema=new Schema({
  coaching_title:{
    type:String
  },
  coaching_id:{
    type:String,
    default:mongoose.Types.ObjectId()
  },
  coaching_detail:{
    type:String
  },
  courses_offer:[courseDetail],
  coaching_address:{
    type:String
  }
})
mongoose.model('courseDetail',courseDetail);
mongoose.model('coachingModel',coachingSchema);
