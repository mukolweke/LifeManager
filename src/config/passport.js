const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // matching user
      User.findOne({ email: email })
       .then(user => {
         if(!user) {
           return done(null, false, { message: 'Email provided is not registerd'});
         }
         
         // match password
         bcrypt.compare(password, user.password, (err, isMatch) => {
           if(err) throw err;

           if(isMatch) {
            return done(null, user)
           }else{
            return done(null, false, { message: 'Password provided is incorrect'});
           }
         });
       })
       .catch(err => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}