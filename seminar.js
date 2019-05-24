const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const nodeMailer=require('nodemailer');
const bodyParser = require('body-parser');





router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());


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

function sendEmail() {

}

router.get("/detail/:id",(req,res)=>{

  SeminarFetch.findById(req.params.id)
  .then(seminar_detail=>{

    //This lets you slice the Date
    let seminar_detail_date_num = (seminar_detail.seminar_date).toString().slice(8,10);
    let seminar_detail_date_month = (seminar_detail.seminar_date).toString().slice(4,7);
    let seminar_detail_date_year = (seminar_detail.seminar_date).toString().slice(13,16);

    SeminarFetch.find({}).limit(4).then(seminarRecom=>{
      res.render('seminar_detail',{
        seminar_detail:seminar_detail,
        seminar_detail_date_num:seminar_detail_date_num,
        seminar_detail_date_month:seminar_detail_date_month,
        seminar_detail_date_year:seminar_detail_date_year,
        seminarRecom:seminarRecom
        // seminar_detail_date_num:seminar_detail_date_num
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
          from:  `Egaming - Seminar inquiry : ${req.body.email}`, // sender address
          to: 'happysoni777@gmail.com', // list of receivers
          subject: `Hi, My name is ${req.body.name} and I want to know about this seminar`, // Subject line
          // text: req.body.body, // plain text body
          html: `<b>Seminar Id </b> : <b style="color:green"> ${req.params.id} </b> <br/>
                  <b>Seminar Title</b> : <b style="color:green"> ${req.body.seminar_title}</b> <br/>
                  <b>Seminar date </b> : <b style="color:green"> ${req.body.seminar_date}</b> <br/>
                  <b>Seminar Price </b> : <b style="color:green">${req.body.seminar_price}</b><br/>
                   <br/> <br/>
                   My name : <b style="color:red">${req.body.name}</b> <br/>
                   My Mobile Number is : <b style="color:red">${req.body.mnumber}</b><br/>
                   My Email Id is : <b style="color:red">${req.body.email}</b><br/>
                   Click here to check the requested seminar,copy and paste this link in browser : localhost:5000/seminar/detail/${req.params.id}

          `// html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.redirect(`/seminar/detail/${req.params.id}`);
          });
      });

      //Adding Seminar

module.exports=router;
