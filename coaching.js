const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const sgMail = require('@sendgrid/mail');
const nodeMailer=require('nodemailer');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

sgMail.setApiKey('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');

require('./models/coaching');

const coachingFetch=mongoose.model('coachingModel');


router.get('/:page',(req,res)=>{
  let query_coaching_name=req.query.coaching_name;
  // console.log(query_coaching_name);
  let query_coaching_type=req.query.coaching_type;
  let query_coaching_price=req.query.coaching_price;
  query_coaching_price=Number(query_coaching_price);
  let query_coaching_city = req.query.coaching_city;
  let perPage=8;
  let page=req.params.page || 1


  if (query_coaching_name!=null || query_coaching_type!=null || query_coaching_city != null) {
    coachingFetch.find({$or:[{"coaching_name":query_coaching_name},{"coaching_type":query_coaching_type},{"coaching_city":query_coaching_city}]})
    .skip((perPage*page)-perPage)
    .limit(perPage)
    .sort({"coaching_price":query_coaching_price,"_id":-1})
    .then(coaching=>{
      coachingFetch.count({$or:[{"coaching_gamename":query_coaching_gamename},{"coaching_gametype":query_coaching_gametype},{"coaching_city":query_coaching_city}]},(err,count)=>{
        console.log("No of docs: ",count);
      }).exec(function(err,count){
        if (err) return err
        res.render('coaching',{
          coaching:coaching,
          current:page,
          pages:Math.ceil(count / perPage),
          coachingCount:count
        });
      })
    })
  }
  else{
    coachingFetch.find({})
    .sort({"coaching_price":query_coaching_price})
    .skip((perPage*page)-perPage)
    .limit(perPage)

    .then(coaching=>{
        coachingFetch.count({},(err,count)=>{
          console.log("No of docs no: ",count);
        }).exec(function(err,count){
          if (err) return err
      res.render('coaching',{
        coaching:coaching,
        current:page,
        pages:Math.ceil(count / perPage),
        coachingCount:count
      });
    })
});
}
});

router.get("/detail/:id",(req,res)=>{
  coachingFetch.findById(req.params.id)
  .then(coaching_detail=>{
    console.log(coaching_detail.courses_offer);
      res.render('coaching_detail',{
        coaching_detail:coaching_detail,
        coaching_course:coaching_detail.courses_offer
      })
    })
  })


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
          from:  `Egaming - coaching inquiry : ${req.body.email}`, // sender address
          to: 'pankaj.bansal@tourdeguide.com', // list of receivers
          subject: `Hi, My name is ${req.body.name} and I want to know about this coaching`, // Subject line
          // text: req.body.body, // plain text body
          html: `<b>coaching Id </b> : <b style="color:green"> ${req.params.id} </b> <br/>
                  <b>coaching Title</b> : <b style="color:green"> ${req.body.coaching_title}</b> <br/>
                  <b>coaching date </b> : <b style="color:green"> ${req.body.coaching_date}</b> <br/>
                  <b>coaching Price </b> : <b style="color:green">${req.body.coaching_price}</b><br/>
                   <br/> <br/>
                   My name : <b style="color:red">${req.body.name}</b> <br/>
                   My Mobile Number is : <b style="color:red">${req.body.mnumber}</b><br/>
                   My Email Id is : <b style="color:red">${req.body.email}</b><br/>
                   Click here to check the requested coaching,copy and paste this link in browser : localhost:5000/coaching/detail/${req.params.id}

          `// html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.redirect(`/coaching/detail/${req.params.id}`);
          });
      });

      //Adding coaching
//coaching

router.get('/courses/:id',(req,res)=>{
  coachingFetch.findById({_id:req.params.id})
  .then(fetchCourse=>{
    let courses = fetchCourse.courses_offer
    let courseCount=(fetchCourse.courses_offer).length
    console.log(courseCount);
    res.render('courses',{
      courses:courses,
      fetchCourse:fetchCourse,
      courseCount:courseCount
    })
  })
})
// router.get('/courses/detail/:id',(req,res)=>{
//   coachingFetch.find({"courses_offer._id":req.params.id})
//   .then(courseDetail=>{
//     res.render('course_detail')
//   })
// })


router.get('/courses/course-detail/:id',(req,res)=>{
  coachingFetch.findOne({"courses_offer._id":req.params.id})
  .then(fetchCourseDetail=>{
    let courseDetail=fetchCourseDetail.courses_offer
    courseDetail.findOne({"courses_offer._id":req.params.id})
    .then(courseDetail1=>{
      console.log(courseDetail1);
    })
    // res.render('course-detail',{
    //   courseDetail:courseDetail
    // })
  })
})


module.exports=router;
