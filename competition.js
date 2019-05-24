const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const sgMail = require('@sendgrid/mail');
const nodeMailer=require('nodemailer');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

sgMail.setApiKey('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');

require('./models/competition');

const competitionFetch=mongoose.model('competitionModel');


router.get('/:page',(req,res)=>{
  let query_competition_name=req.query.competition_name;
  // console.log(query_competition_name);
  let query_competition_type=req.query.competition_type;
  let query_competition_price=req.query.competition_price;
  query_competition_price=Number(query_competition_price);
  let query_competition_city = req.query.competition_city;
  let perPage=8;
  let page=req.params.page || 1


  if (query_competition_name!=null || query_competition_type!=null || query_competition_city != null) {
    competitionFetch.find({$or:[{"competition_name":query_competition_name},{"competition_type":query_competition_type},{"competition_city":query_competition_city}]})
    .skip((perPage*page)-perPage)
    .limit(perPage)
    .sort({"competition_price":query_competition_price,"_id":-1})
    .then(competition=>{
      competitionFetch.count({$or:[{"competition_gamename":query_competition_gamename},{"competition_gametype":query_competition_gametype},{"competition_city":query_competition_city}]},(err,count)=>{
        console.log("No of docs: ",count);
      }).exec(function(err,count){
        if (err) return err
        res.render('competition',{
          competition:competition,
          current:page,
          pages:Math.ceil(count / perPage),
          competitionCount:count
        });
      })
    })
  }
  else{
    competitionFetch.find({})
    .sort({"competition_price":query_competition_price})
    .skip((perPage*page)-perPage)
    .limit(perPage)

    .then(competition=>{
        competitionFetch.count({},(err,count)=>{
          console.log("No of docs no: ",count);
        }).exec(function(err,count){
          if (err) return err
      res.render('competition',{
        competition:competition,
        current:page,
        pages:Math.ceil(count / perPage),
        competitionCount:count
      });
    })
});
}
});

function sendEmail() {

}

router.get("/detail/:id",(req,res)=>{

  competitionFetch.findById(req.params.id)
  .then(competition_detail=>{

    //This lets you slice the Date
    let competition_detail_date_num = (competition_detail.competition_date).toString().slice(8,10);
    let competition_detail_date_month = (competition_detail.competition_date).toString().slice(4,7);
    let competition_detail_date_year = (competition_detail.competition_date).toString().slice(13,16);

    competitionFetch.find({}).limit(4).then(competitionRecom=>{
      res.render('competition_detail',{
        competition_detail:competition_detail,
        competition_detail_date_num:competition_detail_date_num,
        competition_detail_date_month:competition_detail_date_month,
        competition_detail_date_year:competition_detail_date_year,
        competitionRecom:competitionRecom
        // competition_detail_date_num:competition_detail_date_num
      })
    })
  })
});

//email setup

router.post('/detail/sendemail/:id', function (req, res) {
      let transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: 'mytestupwork@gmail.com',
              pass: 'nishantadmin'
          }
      });
      let mailOptions = {
          from:  `Egaming - competition inquiry : ${req.body.email}`, // sender address
          to: 'pankaj.bansal@tourdeguide.com', // list of receivers
          subject: `Hi, My name is ${req.body.name} and I want to know about this competition`, // Subject line
          // text: req.body.body, // plain text body
          html: `<b>competition Id </b> : <b style="color:green"> ${req.params.id} </b> <br/>
                  <b>competition Title</b> : <b style="color:green"> ${req.body.competition_title}</b> <br/>
                  <b>competition date </b> : <b style="color:green"> ${req.body.competition_date}</b> <br/>
                  <b>competition Price </b> : <b style="color:green">${req.body.competition_price}</b><br/>
                   <br/> <br/>
                   My name : <b style="color:red">${req.body.name}</b> <br/>
                   My Mobile Number is : <b style="color:red">${req.body.mnumber}</b><br/>
                   My Email Id is : <b style="color:red">${req.body.email}</b><br/>
                   Click here to check the requested competition,copy and paste this link in browser : localhost:5000/competition/detail/${req.params.id}

          `// html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.redirect(`/competition/detail/${req.params.id}`);
          });
      });

      //Adding competition

module.exports=router;
