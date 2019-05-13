const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const sgMail = require('@sendgrid/mail');
const nodeMailer=require('nodemailer');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
require('./models/article');

const articleFetch=mongoose.model('articleModel');

router.get('/:page',(req,res)=>{
  let query_article_title=req.query.article_title;
  let query_article_detail=req.query.article_detail;
  let query_article_tags=req.query.article_tags;
  let query_article_date_pub=req.query.article_date_pub;
  let query_article_mustRead=req.query.query_article_mustRead;
  let query_article_image = req.query.article_image;
  let perPage=8;
  let page=req.params.page || 1

    articleFetch.find({})
    .sort({"query_article_date_pub":-1})
    .skip((perPage*page)-perPage)
    .limit(perPage)

    .then(article=>{
        articleFetch.count({},(err,count)=>{
          console.log("No of docs no: ",count);
        }).exec(function(err,count){
          if (err) return err
      res.render('article',{
        article:article,
        current:page,
        pages:Math.ceil(count / perPage),
        articleCount:count
      });
    })
});
});



router.get("/detail/:id",(req,res)=>{

  articleFetch.findById(req.params.id)
  .then(article_detail=>{

    //This lets you slice the Date
    let article_detail_date_num = (article_detail.article_date_pub).toString().slice(8,10);
    let article_detail_date_month = (article_detail.article_date_pub).toString().slice(4,7);
    let article_detail_date_year = (article_detail.article_date_pub).toString().slice(13,16);

    articleFetch.find({}).limit(4).then(articleRecom=>{
      res.render('article_detail',{
        article_detail:article_detail,
        article_detail_date_num:article_detail_date_num,
        article_detail_date_month:article_detail_date_month,
        article_detail_date_year:article_detail_date_year,
        articleRecom:articleRecom
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
              user: 'happysoni777@gmail.com',
              pass: 'Nokiax123@'
          }
      });
      let mailOptions = {
          from:  `${req.body.email}`, // sender address
          to: 'happysoni777@gmail.com', // list of receivers
          subject: `Egaming - Subscribing Request`, // Subject line
          // text: req.body.body, // plain text body
          html: `
            user ${req.body.email} wants to subscribe to the latest news / events / articles
          `// html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.redirect(`/article/detail/${req.params.id}`);
          });
      });

      //Adding article

module.exports=router;
