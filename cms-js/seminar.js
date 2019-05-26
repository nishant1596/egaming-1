const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const fs=require('fs');
const countrystate=require('countrycitystatejson');
require('../models/seminar');
const upload=require('../config/file-upload');
//Load Authentication (auth module)
const {ensureAuthenticated}=require('../config/auth');
const Seminar=mongoose.model('seminarModel');
var ObjectId = require('mongodb').ObjectID;
router.delete('/delete/:id',ensureAuthenticated,(req,res)=>{
  Seminar.findOne({_id:mongoose.Types.ObjectId(req.params.id)})
  .then(finded=>{
    console.log(finded.seminar_image);
    //delete from s3 here
  })
  Seminar.deleteOne({_id:req.params.id})
  .then(deletingSeminar=>{
    console.log('deleted from mongodb');
    res.redirect('/');
  })
})



router.get('/',ensureAuthenticated,(req,res)=>{

  Seminar.find({}).sort({"_id":-1})
  .then(seminar_list=>{
    res.render('cms/seminar/index',{
      seminar_list:seminar_list,
    });
  })
});


router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
  Seminar.findOne({_id:req.params.id})
  .then(seminar_edit=>{
    res.render('cms/seminar/edit',{
      seminar_edit:seminar_edit
    })
  })
})

router.put('/:id',ensureAuthenticated,(req,res)=>{

  Seminar.findOne({_id:req.params.id})
  .then(editing_seminar=>{
    editing_seminar.seminar_title=req.body.seminar_title,
    editing_seminar.seminar_detail=req.body.seminar_detail,
    editing_seminar.seminar_date=req.body.seminar_date,
    editing_seminar.seminar_gamename=req.body.seminar_gamename,
    editing_seminar.seminar_price=req.body.seminar_price,
    editing_seminar.seminar_gametype=req.body.seminar_gametype,
    // editing_seminar.seminar_image=file_location,
    editing_seminar.seminar_address=req.body.seminar_address,
    editing_seminar.seminar_tags=req.body.seminar_tags,
    editing_seminar.seminar_country=req.body.seminar_country,
    editing_seminar.seminar_state=req.body.seminar_state,
    editing_seminar.seminar_city= req.body.seminar_city
    editing_seminar.save()
    .then(sem=>{
      console.log('seminar edited');
      res.redirect('/cms/seminar')
    })
  })


})
// let countryName=countrystate.getCountries()


// let getco=function(){
//   console.log('hello');
// }

router.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('cms/seminar/add',{
    getCountry:countrystate.getCountries(),
    getStateByCountry:countrystate.getStatesByShort('IN'),
    getCityByState:countrystate.getCities('IN',countrystate.getStatesByShort('IN'))
  });
});

router.post('/add',ensureAuthenticated,(req,res)=>{


//Insert into Database and upoad it on s3
    var singleUpload = upload.single('file');
    singleUpload(req, res, function(err, some) {
    if (err) {
      console.log(err);
      return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
    }
    const newSeminar = {
      seminar_title:req.body.seminar_title,
      seminar_detail:req.body.seminar_detail,
      seminar_date:req.body.seminar_date,
      seminar_gamename:req.body.seminar_gamename,
      seminar_price:req.body.seminar_price,
      seminar_gametype:req.body.seminar_gametype,
      seminar_address:req.body.seminar_address,
      seminar_tags:req.body.seminar_tags,
      seminar_country:req.body.seminar_country,
      seminar_city:req.body.seminar_city,
      seminar_image:req.file.location
    }
    console.log(req.file);
    // return res.json({'imageUrl': req.file.location});

    //storing data and req.file.location in mongoose
    new Seminar(newSeminar).save().then(result=>{
      console.log(result.seminar_image);
      res.redirect('/cms/seminar/add')
    })

  });

})



module.exports=router;
