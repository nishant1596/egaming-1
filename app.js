const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const bodyParser=require('body-parser');
const app = express();
const mongoose = require('mongoose');
const methodOverride=require('method-override');
const upload = require('express-fileupload');
const port = process.env.PORT || 5000;

//importing seminar model
require('./models/seminar');
require('./models/competition');
require('./models/article');
require('./models/coaching');

//using imported seminar model as SeminarFetch4 (fetching 6 Top seminar on front page)
const SeminarFetch6=mongoose.model('seminarModel');
const CompetitionFetch6=mongoose.model('competitionModel');
const ArticleFetch6=mongoose.model('articleModel');

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
    }
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(upload());

//Mongo Configuration
const mongoURI='mongodb://admin1123:admin1123456@ds153096.mlab.com:53096/egaming-node';
const devURI='mongodb://localhost/seminar_node'




mongoose.connect(mongoURI, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error:'));
db.once('open', function() {
  console.log('we are connected to MongoDB');
});


//Routes
app.get('/', function (req, res) {

  SeminarFetch6.find({}).limit(6).sort({"_id":-1})
  .then(seminarfetched6=>{

    CompetitionFetch6.find({}).limit(6).sort({"_id":-1})
    .then(competitionfetched6=>{
      // console.log('article',articlefetched6);
      ArticleFetch6.find({}).limit(6).sort({"_id":-1}).then(articlefetched6=>{
        res.render('index',{
          seminarfetched6:seminarfetched6,
          competitionfetched6:competitionfetched6,
          articlefetched6:articlefetched6
        });
      })
    })
  })
});
//Defining Routers
app.use('/cms/seminar',seminar);
app.use('/seminar',seminar_for_user);

app.use('/cms/competition',competition);
app.use('/competition',competition_for_user);

app.use('/cms/coaching',coaching);
app.use('/coaching',coaching_for_user);

app.use('/cms/article',article);
app.use('/article',article_for_user);
app.listen(port,()=>{
  console.log('process is running on port '+port);
});
