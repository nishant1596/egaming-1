const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const fs=require('fs');
const countrystate=require('countrycitystatejson');
require('../models/coaching');
const {ensureAuthenticated}=require('../config/auth');

// const courseDetail=mongoose.model('courseDetail');
const coaching=mongoose.model('coachingModel');

//seting file path for deletion
let filenamepath = './public/uploads/';



router.delete('/delete/:id',ensureAuthenticated,(req,res)=>{
  coaching.deleteOne({_id:req.params.id})
  .then(deletingcoaching=>{
    console.log('deleted from mongodb');
    res.redirect('/');
  })
})



router.get('/',ensureAuthenticated,(req,res)=>{

  coaching.find({}).sort({"_id":-1})
  .then(coaching_list=>{
    res.render('cms/coaching/index',{
      coaching_list:coaching_list,
    });
  })
});


router.get('/edit/edit-coaching/:id',ensureAuthenticated,(req,res)=>{
  coaching.findOne({_id:req.params.id})
  .then(coaching_edit=>{
    res.render('cms/coaching/edit-coaching',{
      coaching_edit:coaching_edit
    })
  })
});

router.put('/edit/edit-coaching/:id',ensureAuthenticated,(req,res)=>{
  coaching.findOne({_id:req.params.id})
  .then(coaching_edit=>{
    res.render('cms/coaching/edit-coaching',{
      coaching_edit:coaching_edit
    })
  })
});

router.put('/:id',ensureAuthenticated,(req,res)=>{
  coaching.findOne({_id:req.params.id})
  .then(editing_coaching=>{
    editing_coaching.coaching_title=req.body.coaching_title,
    editing_coaching.coaching_detail=req.body.coaching_detail,
    editing_coaching.coaching_date=req.body.coaching_date,
    editing_coaching.coaching_name=req.body.coaching_name,
    editing_coaching.coaching_price=req.body.coaching_price,
    editing_coaching.coaching_type=req.body.coaching_type,
    // coaching_image:req.body.coaching_image,
    editing_coaching.coaching_address=req.body.coaching_address,
    editing_coaching.coaching_country=req.body.coaching_country,
    editing_coaching.coaching_state=req.body.coaching_state,
    editing_coaching.coaching_city= req.body.coaching_city
    editing_coaching.save()
    .then(sem=>{
      console.log('coaching edited');
      req.flash('success_msg','Coaching Updated Successfully')
      res.redirect('/cms/coaching')
    })
  })
})
// let countryName=countrystate.getCountries()


// let getco=function(){
//   console.log('hello');
// }

router.get('/add/add-coaching',ensureAuthenticated,(req,res)=>{
  res.render('cms/coaching/add-coaching',{
    getCountry:countrystate.getCountries(),
    getStateByCountry:countrystate.getStatesByShort('IN'),
    getCityByState:countrystate.getCities('IN',countrystate.getStatesByShort('IN'))
  });
});

router.post('/add/add-coaching',ensureAuthenticated,(req,res)=>{

  const newcoaching = {
    coaching_title:req.body.coaching_title,
    coaching_detail:req.body.coaching_detail,
    coaching_featureIt:req.body.coaching_isPremium,
    coaching_address:req.body.coaching_address
  }
  new coaching(newcoaching)
  .save()
  .then(coachings=>{
    console.log('data is saved successfully');
    req.flash('success_msg','Coaching Added Successfully')
    res.redirect('/cms/coaching')
  })
});

router.get('/edit/list-courses/:id',ensureAuthenticated,(req,res)=>{
  coaching.find({_id:req.params.id}).then(result=>{
    // console.log(result);
    let courseResult = result[0].courses_offer
    // console.log(result[0].courses_offer[0]);
    res.render('cms/coaching/courses-list',{
      courseResult:courseResult
    })
  })
})
router.get('/add/add-courses/:id',ensureAuthenticated,(req,res)=>{
  coaching.findById({_id:req.params.id})
  .then(resultCoaching=>{
    console.log(resultCoaching);
    res.render('cms/coaching/add-courses',{
      resultCoaching:resultCoaching
    })
  })
})
// /:id is coaching id
router.put('/add/add-courses/:id',ensureAuthenticated,(req,res)=>{
  const newcourse=[{
    course_name:req.body.course_name,
    course_detail:req.body.course_detail,
    course_duration:req.body.course_duration,
    course_price:req.body.course_price,
    course_seats:req.body.course_seats,
    course_has_offer:req.body.course_has_offer,
    course_has_offer_text:req.body.course_has_offer_text
  }]
  coaching.findOneAndUpdate({_id:req.params.id},{$push:{courses_offer:newcourse}})
  .then(addedNewCourseToArray=>{
    console.log('Added New Course to the Array');
    // var course_count=coaching.find({_id:req.params.id}).courses_offer.length;
    req.flash('success_msg',`Course is successfully added to the coaching`)
    res.redirect('/cms/coaching');
  })
});

router.put('/edit/edit-courses/:course_id',ensureAuthenticated,(req,res)=>{
  const updatingCourse={
    course_name:req.body.course_name,
    course_detail:req.body.course_detail,
    course_duration:req.body.course_duration,
    course_price:req.body.course_price,
    course_seats:req.body.course_seats,
    course_has_offer:req.body.course_has_offer,
    course_has_offer_text:req.body.course_has_offer_text
  }
  // coaching.findOneAndUpdate({_id:req.params.id},{$push:{courses_offer:newcourse}})
  // .then(addedNewCourseToArray=>{
  //   console.log('Added New Course to the Array');
  //   // var course_count=coaching.find({_id:req.params.id}).courses_offer.length;
  //   res.redirect('/cms/coaching');
  // })
  coaching.update({'courses_offer._id':req.params.course_id},{$set:{'course_name':req.body.course_name,
  'courses_offer.$.course_detail':req.body.course_detail,
  'courses_offer.$.course_duration':req.body.course_duration,
  'courses_offer.$.course_price':req.body.course_price,
  'courses_offer.$.course_seats':req.body.course_seats,
  'courses_offer.$.course_has_offer':req.body.course_has_offer,
  'courses_offer.$.course_has_offer_text':req.body.course_has_offer_text}})
  .then(courseUpdated=>{
    console.log(courseUpdated);
    req.flash('success_msg','Course Updated Successfully')
    console.log('updated successfully');
    res.redirect('/cms/coaching')
  })
});

router.get('/edit/edit-courses/:course_id',ensureAuthenticated,(req,res)=>{
  coaching.findOne({'courses_offer._id':req.params.course_id})
  .then(courseDetail=>{
    console.log(courseDetail);
    let courses_offer_array=courseDetail.courses_offer[0]
    res.render('cms/coaching/edit-course',{
      courseDetail:courseDetail,
      courses_offer:courses_offer_array
    })
  })
})
module.exports=router;
