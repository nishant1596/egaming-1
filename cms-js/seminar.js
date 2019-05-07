const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const fs=require('fs');
require('../models/seminar');
const Seminar=mongoose.model('seminarModel');

//seting file path for deletion
let filenamepath = './public/uploads/';

router.delete('/:id',(req,res)=>{
  Seminar.findOne({_id:req.params.id})
  .then(finded=>{
    console.log(finded.seminar_image);
    fs.unlinkSync(filenamepath+finded.seminar_image, (err)=>{
      if (err) {
        return err;
      }
      else{
        console.log('file deleted');
      }
    })
  })
  Seminar.deleteOne({_id:req.params.id})
  .then(deletingSeminar=>{
    console.log('deleted from mongodb');
    res.redirect('/');
  })
})


router.get('/',(req,res)=>{
  Seminar.find({}).sort({"_id":-1})
  .then(seminar_list=>{
    res.render('cms/seminar/index',{layout: 'cms-layout.handlebars',seminar_list:seminar_list }
  );
  })
});


router.get('/edit/:id',(req,res)=>{
  Seminar.findOne({_id:req.params.id})
  .then(seminar_edit=>{
    res.render('cms/seminar/edit',{layout: 'cms-layout.handlebars',seminar_edit:seminar_edit})
  })
})

router.put('/:id',(req,res)=>{

  let file=req.files.seminar_image;
  let filename=file.name;
  console.log(filename);
  let dirUploads='./public/uploads/';
  let uploadingFileName=Date.now()+'-'+filename;
  file.mv(dirUploads+uploadingFileName,(err)=>{
    if (err) {
      return err;
    }
  });

  Seminar.findOne({_id:req.params.id})
  .then(editing_seminar=>{
    editing_seminar.seminar_title=req.body.seminar_title,
    editing_seminar.seminar_detail=req.body.seminar_detail,
    editing_seminar.seminar_date=req.body.seminar_date,
    editing_seminar.seminar_city=req.body.seminar_city,
    editing_seminar.seminar_gamename=req.body.seminar_gamename,
    editing_seminar.seminar_address=req.body.seminar_address,
    editing_seminar.seminar_image=uploadingFileName;
    editing_seminar.save()
    .then(sem=>{
      res.redirect('/cms/seminar')
    })
  })
})



router.get('/add',(req,res)=>{
  res.render('cms/seminar/add');
});

router.post('/add',(req,res)=>{
  let file=req.files.seminar_image;
  let filename=file.name;
  console.log(filename);
  let dirUploads='./public/uploads/';
  let uploadingFileName=Date.now()+'-'+filename;
  file.mv(dirUploads+uploadingFileName,(err)=>{
    if (err) {
      return err;
    }
  });
  const newSeminar = {
    seminar_title:req.body.seminar_title,
    seminar_detail:req.body.seminar_detail,
    seminar_date:req.body.seminar_date,
    seminar_city:req.body.seminar_city,
    seminar_gamename:req.body.seminar_gamename,
    seminar_price:req.body.seminar_price,
    seminar_gametype:req.body.seminar_gametype,
    seminar_address:req.body.seminar_address,
    seminar_image:uploadingFileName
  }
  new Seminar(newSeminar)
  .save()
  .then(seminars=>{
    console.log('data is saved successfully');
    res.redirect('/seminar/1')
  })
})
module.exports=router;
