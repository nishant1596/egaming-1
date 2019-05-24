const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const fs=require('fs');
const countrystate=require('countrycitystatejson');
require('../models/competition');
const competition=mongoose.model('competitionModel');
const {ensureAuthenticated}=require('../config/auth');

//seting file path for deletion
let filenamepath = './public/uploads/';

router.delete('/delete/:id',ensureAuthenticated,(req,res)=>{
  // competition.findOne({_id:req.params.id})
  // .then(finded=>{
  //   console.log(finded.competition_image);
  //   fs.unlinkSync(filenamepath+finded.competition_image, (err)=>{
  //     if (err) {
  //       return err;
  //     }
  //     else{
  //       console.log('file deleted');
  //     }
  //   })
  // })
  competition.deleteOne({_id:req.params.id})
  .then(deletingcompetition=>{
    console.log('deleted from mongodb');
    res.redirect('/');
  })
})



router.get('/',ensureAuthenticated,(req,res)=>{

  competition.find({}).sort({"_id":-1})
  .then(competition_list=>{
    res.render('cms/competition/index',{
      competition_list:competition_list,
    });
  })
});


router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
  competition.findOne({_id:req.params.id})
  .then(competition_edit=>{
    res.render('cms/competition/edit',{
      competition_edit:competition_edit
    })
  })
})

router.put('/:id',ensureAuthenticated,(req,res)=>{

  // let file=req.files.competition_image;
  // let filename=file.name;
  // console.log(filename);
  // let dirUploads='./public/uploads/';
  // let uploadingFileName=Date.now()+'-'+filename;
  // file.mv(dirUploads+uploadingFileName,(err)=>{
  //   if (err) {
  //     return err;
  //   }
  // });

  competition.findOne({_id:req.params.id})
  .then(editing_competition=>{
    editing_competition.competition_title=req.body.competition_title,
    editing_competition.competition_detail=req.body.competition_detail,
    editing_competition.competition_date=req.body.competition_date,
    editing_competition.competition_name=req.body.competition_name,
    editing_competition.competition_price=req.body.competition_price,
    editing_competition.competition_type=req.body.competition_type,
    // competition_image:req.body.competition_image,
    editing_competition.competition_address=req.body.competition_address,
    editing_competition.competition_country=req.body.competition_country,
    editing_competition.competition_state=req.body.competition_state,
    editing_competition.competition_city= req.body.competition_city
    editing_competition.save()
    .then(sem=>{
      console.log('competition edited');
      res.redirect('/cms/competition')
    })
  })
})
// let countryName=countrystate.getCountries()


// let getco=function(){
//   console.log('hello');
// }

router.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('cms/competition/add',{
    getCountry:countrystate.getCountries(),
    getStateByCountry:countrystate.getStatesByShort('IN'),
    getCityByState:countrystate.getCities('IN',countrystate.getStatesByShort('IN'))
  });
});

router.post('/add',ensureAuthenticated,(req,res)=>{
  // let file=req.files.competition_image;
  // let filename=file.name;
  // console.log(filename);
  // let dirUploads='./public/uploads/';
  // let uploadingFileName=Date.now()+'-'+filename;
  // file.mv(dirUploads+uploadingFileName,(err)=>{
  //   if (err) {
  //     return err;
  //   }
  // });
  console.log(req.files);
  const newcompetition = {
    competition_title:req.body.competition_title,
    competition_detail:req.body.competition_detail,
    competition_date:req.body.competition_date,
    competition_name:req.body.competition_name,
    competition_price:req.body.competition_price,
    competition_type:req.body.competition_type,
    competition_address:req.body.competition_address,
    competition_country:req.body.competition_country,
    competition_state:req.body.competition_state,
    competition_city:req.body.competition_city,
    competition_duration:req.body.competition_duration,
    competition_isPremium:req.body.competition_isPremium
  }
  new competition(newcompetition)
  .save()
  .then(competitions=>{
    console.log('data is saved successfully');
    res.redirect('/competition/1')
  })
})
module.exports=router;
