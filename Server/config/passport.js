const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

module.exports = function(passport) {
  passport.use('doctor-local',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      Doctor.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.use('patient-local',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      Patient.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            //console.log(user);
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );
  passport.serializeUser(function(user, done) {
    var key = {
      id: user.id,
      type: user.userType
    }
    done(null,key);
  });

  passport.deserializeUser(function(key, done) {
    var Model=key.type=="1"?Doctor:Patient;
    Model.findById(key.id, function(err, user) {
      done(err, user);
    });
});

}