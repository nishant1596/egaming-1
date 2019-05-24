const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const fs=require('fs');
const countrystate=require('countrycitystatejson');
require('../models/article');
const article=mongoose.model('articleModel');
const {ensureAuthenticated}=require('../config/auth');

//seting file path for deletion
let filenamepath = './public/uploads/';

router.delete('/delete/:id',ensureAuthenticated,(req,res)=>{
  article.deleteOne({_id:req.params.id})
  .then(deletingarticle=>{
    console.log('deleted from mongodb');
    res.redirect('/');
  })
})



router.get('/',ensureAuthenticated,(req,res)=>{
  article.find({}).sort({"_id":-1})
  .then(article_list=>{
    res.render('cms/article/index',{
      article_list:article_list,
    });
  })
});


router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
  article.findOne({_id:req.params.id})
  .then(article_edit=>{
    res.render('cms/article/edit',{
      article_edit:article_edit,
    })
  })
})

router.put('/:id',ensureAuthenticated,(req,res)=>{

  article.findOne({_id:req.params.id})
  .then(editing_article=>{
    editing_article.article_title=req.body.article_title,
    editing_article.article_detail=req.body.article_detail,
    editing_article.article_date=req.body.article_date,
    editing_article.article_name=req.body.article_name,
    editing_article.article_price=req.body.article_price,
    editing_article.article_type=req.body.article_type,
    // article_image:req.body.article_image,
    editing_article.article_address=req.body.article_address,
    editing_article.article_country=req.body.article_country,
    editing_article.article_state=req.body.article_state,
    editing_article.article_city= req.body.article_city
    editing_article.save()
    .then(sem=>{
      console.log('article edited');
      req.flash('success_msg','Article Updated Successfully')
      res.redirect('/cms/article')
    })
  })
})
// let countryName=countrystate.getCountries()


function getco(){
  console.log('hello');
}

router.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('cms/article/add',{
    getCountry:countrystate.getCountries(),
    getcom:getco,
    getStateByCountry:countrystate.getStatesByShort('IN'),
    getCityByState:countrystate.getCities('IN',countrystate.getStatesByShort('IN'))
  });
});

router.post('/add',ensureAuthenticated,(req,res)=>{
  // let file=req.files.article_image;
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
  const newarticle = {
    article_title:req.body.article_title,
    article_detail:req.body.article_detail,
    article_date:req.body.article_date,
    article_name:req.body.article_name,
    article_price:req.body.article_price,
    article_type:req.body.article_type,
    article_address:req.body.article_address,
    article_country:req.body.article_country,
    article_state:req.body.article_state,
    article_city:req.body.article_city,
    article_duration:req.body.article_duration,
    article_isPremium:req.body.article_isPremium
  }
  new article(newarticle)
  .save()
  .then(articles=>{
    req.flash('success_msg','Article Added Successfully')
    console.log('data is saved successfully');
    res.redirect('/article/1')
  })
})
module.exports=router;
