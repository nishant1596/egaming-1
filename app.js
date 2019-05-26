const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const bodyParser=require('body-parser');
const app = express();
const mongoose = require('mongoose');
const methodOverride=require('method-override');
// const upload = require('express-fileupload');
const port = process.env.PORT || 5000;
const flash=require('connect-flash');
const session=require('express-session');
const multer = require('multer');
const multerS3 = require('multer-s3');
const bcrypt=require('bcryptjs');
const passport=require('passport');
const moment = require('moment');
moment().format();
// const upload = require('./config/file-upload');


app.listen(port,()=>{
  console.log('process is running on port '+port);
});

//importing seminar model
require('./models/seminar');
require('./models/competition');
require('./models/article');
require('./models/coaching');
require('./models/admin');
require('./config/passport')(passport);

//using imported seminar model as SeminarFetch4 (fetching 6 Top seminar on front page)
const SeminarFetch6=mongoose.model('seminarModel');
const CompetitionFetch6=mongoose.model('competitionModel');
const ArticleFetch6=mongoose.model('articleModel');
const Admin=mongoose.model('adminModel');
const CoachingFetch6=mongoose.model('coachingModel')
//importing the cms and other needed files for routing configuration
const seminar=require('./cms-js/seminar');
const competition=require('./cms-js/competition')
const seminar_for_user=require('./seminar.js');
const competition_for_user=require('./competition.js');
const article_for_user=require('./article');
const article=require('./cms-js/article');
const coaching_for_user=require('./coaching');
const coaching=require('./cms-js/coaching');

//Handlebars
var hbs=exphbs.create({
  defaultLayout: 'main',
  helpers:{
    assignmentOperator:function(v1,operator,v2,options){
      switch(operator){
        case '=':
          return (v1 = v2);
        case '-':
          return (v1 - v2);
        case '+':
          return (v1 + v2);
        case '*':
          return (v1 * v2);
        case '/':
          return (v1 / v2);
        case '+=':
          return (v1=v1+v2);
        case '-=':
          return (v1=v1-v2);
      }
    },
    ifCond:function(v1,v2,options){
      if (v1==v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    times:function(n,block) {
      var accum='';
      for (var i = 1; i <= n; i++)
        accum+=block.fn(i);
        return accum;
    },
    formatTime:function(date, format){
      var mmnt = moment(date);
    return mmnt.format(format);
    }
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
// app.use(upload());

//flash and session middlewares
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true
}));
//passport middlewares
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//Global variabls for flash
app.use(function(req,res,next){
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error=req.flash('error');
  res.locals.error_msg=req.flash('error_msg')
  next();
})

//Mongo Configuration
const mongoURI='mongodb://admin1123:admin1123456@ds153096.mlab.com:53096/egaming-node';
const devURI='mongodb://localhost/seminar_node'




mongoose.connect(devURI, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error:'));
db.once('open', function() {
  console.log('we are connected to MongoDB');
});


//Routes
app.get('/', function (req, res) {

  SeminarFetch6.find().sort({"_id":-1}).limit(6)
  .then(seminarfetched6=>{
    for (var i = 0; i < seminarfetched6.length; i++) {
      if ((seminarfetched6[i].seminar_title).length>35) {
          seminarfetched6[i].seminar_title=(seminarfetched6[i].seminar_title).substring(0,35) + '...'
      }
    }
    CompetitionFetch6.find({}).sort({"_id":-1}).limit(6)
    .then(competitionfetched6=>{
      // console.log('article',articlefetched6);
      ArticleFetch6.find({}).sort({"_id":-1}).limit(6).then(articlefetched6=>{
        CoachingFetch6.find({}).sort({"_id":-1}).limit(6).then(coachingfetched6=>{
          // console.log(articlefetched6);
          for (var i = 0; i < articlefetched6.length; i++) {
            if ((articlefetched6[i].article_title).length>35) {
                articlefetched6[i].article_title=(articlefetched6[i].article_title).substring(0,35) + '...'
            }
          }
          for (var i = 0; i < coachingfetched6.length; i++) {
            if ((coachingfetched6[i].coaching_title).length>35) {
                coachingfetched6[i].coaching_title=(coachingfetched6[i].coaching_title).substring(0,35) + '...'
            }
          }
          for (var i = 0; i < competitionfetched6.length; i++) {
            if ((competitionfetched6[i].competition_title).length>35) {
                competitionfetched6[i].competition_title=(competitionfetched6[i].competition_title).substring(0,35) + '...'
            }
          }
          //Slicing Date
          // Method 1
          // var seminardate_day=[];
          // var seminardate_month=[];
          // var seminardate_year=[];
          // var a=[];
          // for (var i = 0; i < seminarfetched6.length; i++) {
          //   seminardate_day[i]=(seminarfetched6[i].seminar_date).getDate()
          //   seminardate_month[i]=(seminarfetched6[i].seminar_date).getMonth()
          //   seminardate_year[i]=(seminarfetched6[i].seminar_date).getFullYear()
          //   a[i]=seminarfetched6[i].seminar_date=`${seminardate_day[i]}/${seminardate_month[i]}/${seminardate_year[i]}`;
          // }

          //method 2 (convert date object to string)
          for (var i = 0; i < seminarfetched6.length; i++) {
            seminarfetched6[i].seminar_date=(seminarfetched6[i].seminar_date).toString();
            console.log((seminarfetched6[i].seminar_date).toString());

          }
          res.render('index',{
          seminarfetched6:seminarfetched6,
          competitionfetched6:competitionfetched6,
          articlefetched6:articlefetched6,
          coachingfetched6:coachingfetched6
        });
      })
      })
    })
  })
});

app.get('/signup/123456789pankaj',(req,res)=>{
  res.render('cms/signup')
})
app.put('/signup/123456789pankaj',(req,res)=>{
  const newAdmin = {
    email:req.body.email,
    password:req.body.password1
  }
  Admin.findOne({"_id":"5cdf9abd9a6f8f5df022d762"})
  .then(updating=>{
    updating.email=req.body.email
    updating.password=req.body.password1
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(updating.password, salt, function(err, hash) {
          updating.password=hash;
          updating.save()
          .then(updated=>{
            console.log(updated);
            res.redirect('/signup/123456789pankaj')
          })
        });
    });

  })
  })
app.get('/login',(req,res)=>{
  res.render('cms/login')
})
app.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/cms/seminar',
    failureRedirect:'/login',
    failureFlash:true
  })(req,res,next);
})
app.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success_msg','you are logged out')
  res.redirect('/login')
})
app.get('/about',(req,res)=>{
  res.render('about')
})
app.get('/contact',(req,res)=>{
  res.render('contact')
});
app.get('/sponsor',(req,res)=>{
  res.render('sponsor')
})
//Defining Routers
app.use('/cms/seminar',seminar);
app.use('/seminar',seminar_for_user);

app.use('/cms/competition',competition);
app.use('/competition',competition_for_user);

app.use('/cms/coaching',coaching);
app.use('/coaching',coaching_for_user);

app.use('/cms/article',article);
app.use('/article',article_for_user);
