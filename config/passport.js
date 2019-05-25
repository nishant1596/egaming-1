const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

//Load Models
require('../models/admin');
const Admin=mongoose.model('adminModel');

module.exports=function(passport){
  passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
    Admin.findOne({
      email:email
    }).then(user=>{
      if (!user) {
        return done(null,false,{message:'No User Found'});
      }
      bcrypt.compare(password,user.password, (err,isMatch)=>{
        console.log(user.passport);
        if (err) throw err;
        if(isMatch){
          return done(null,user);
        }
        else{
          return done(null,false,{message:'password incorrect'})
        }
      })
    })
  }));

  passport.serializeUser(function(user,done){
    done(null,user.id);
  });
  passport.deserializeUser(function(id,done){
    Admin.findById(id,function(err,user){
      done(err,user);
    })
  })
}
