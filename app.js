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

//using imported seminar model as SeminarFetch4 (fetching 6 Top seminar on front page)
const SeminarFetch6=mongoose.model('seminarModel');

//importing the cms and other needed files for routing configuration
const seminar=require('./cms-js/seminar');
const seminar_for_user=require('./seminar.js');

//Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
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
    console.log(seminarfetched6);
    res.render('index',{
      seminarfetched6:seminarfetched6
    });
  })
});
//Defining Routers
app.use('/cms/seminar',seminar);
app.use('/seminar',seminar_for_user);

app.listen(port,()=>{
  console.log('process is running on port '+port);
});
