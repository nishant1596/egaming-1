const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');



require('./models/seminar');

const SeminarFetch=mongoose.model('seminarModel');


router.get('/:page',(req,res)=>{
  let query_seminar_gamename=req.query.seminar_gamename;
  console.log(query_seminar_gamename);
  let query_seminar_gametype=req.query.seminar_gametype;
  let query_seminar_price=req.query.seminar_price;
  query_seminar_price=Number(query_seminar_price);
  let query_seminar_city = req.query.seminar_city;
  let perPage=8;
  let page=req.params.page || 1


  if (query_seminar_gamename!=null || query_seminar_gametype!=null || query_seminar_city != null) {
    SeminarFetch.find({$or:[{"seminar_gamename":query_seminar_gamename},{"seminar_gametype":query_seminar_gametype},{"seminar_city":query_seminar_city}]})
    .skip((perPage*page)-perPage)
    .limit(perPage)
    .sort({"seminar_price":query_seminar_price,"_id":-1})
    .then(seminar=>{
      SeminarFetch.count({$or:[{"seminar_gamename":query_seminar_gamename},{"seminar_gametype":query_seminar_gametype},{"seminar_city":query_seminar_city}]},(err,count)=>{
        console.log("No of docs: ",count);
      }).exec(function(err,count){
        if (err) return err
        res.render('seminar',{
          seminar:seminar,
          current:page,
          pages:Math.ceil(count / perPage),
          seminarCount:count
        });
      })
    })
  }
  else{
    SeminarFetch.find({})
    .sort({"seminar_price":query_seminar_price})
    .skip((perPage*page)-perPage)
    .limit(perPage)

    .then(seminar=>{
        SeminarFetch.count({},(err,count)=>{
          console.log("No of docs no: ",count);
        }).exec(function(err,count){
          if (err) return err
      res.render('seminar',{
        seminar:seminar,
        current:page,
        pages:Math.ceil(count / perPage),
        seminarCount:count
      });
    })
});
}
});
router.get("/detail/:id",(req,res)=>{
  SeminarFetch.findById(req.params.id)
  .then(seminar_detail=>{

    //This lets you slice the Date
    let seminar_detail_date = (seminar_detail.seminar_date).toString().slice(0, 15);

    res.render('seminar_detail',{
      seminar_detail:seminar_detail,
      seminar_detail_date:seminar_detail_date
    })
  })
});


module.exports=router;
