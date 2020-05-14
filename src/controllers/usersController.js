const bcrypt = require('bcryptjs');
const { validateRegistrationForm, validateForgetPassForm, validateResetPassForm } = require('../helpers/helper');
const passport = require('passport');

function usersController(User) {
  function getLogin(req, res) {
    res.render('login')
  }

  function getRegister(req, res) {
    res.render('login')
  }

  function saveUser(req, res) {
    const { name, email, password, password_confirm } = req.body;
    let errors = [];

    validateRegistrationForm(name, email, password, password_confirm, errors);

    if (errors.length > 0) {
      res.render('register', {
        errors, name, email, password, password_confirm
      })
    } else {
      User.findOne({ email: email })
        .then(user => {
          if (user) {
            errors.push({ msg: 'Email is already registered' });

            res.render('register', {
              errors, name, email, password, password_confirm
            });
          } else {
            const newUser = new User({
              name, email, password
            });

            bcrypt.genSalt(10, (err, salt) => {
              if (err) throw err;

              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                newUser.password = hash;
                newUser.save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/users/login')
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        })
        .catch(err => console.log(err));
    }
  }

  function loginUser(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  }

  function logoutUser(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  }

  function getForgotPass(req, res) {

    if (req.query.userId) {
      let user_id = req.query.userId;

      User.findOne({ _id: user_id })
        .then(user => {
          if (!user) {
            req.flash('error_msg', 'Something wrong with account. Contact admin for help');
            res.redirect('/users/login')
          }
          res.render('forgot-pass-reset', { user })
        })
        .catch(err => console.log(err));
    } else {
      res.render('forgot-pass')
    }
  }

  function getForgotPassReset(req, res) {
    let userId = req.query.userId;

    User.findOne({ _id: userId })
      .then(user => {
        if (!user) {
          req.flash('error_msg', 'Something wrong with account. Contact admin for help');
          res.redirect('/users/login')
        }

        res.render('forgot-pass-reset', { user })
      })
      .catch(err => console.log(err));
  }

  function updatePassword(req, res) {
    const { password, password_confirm, user_id } = req.body;
    let errors = [];

    validateResetPassForm(password, password_confirm, errors);

    User.findOne({ _id: user_id })
      .then(user => {
        if (errors.length > 0) {
          req.flash('error', 'Fill all fields correctly and they must match');
          res.redirect('forgot-pass-reset/?userId=' + user._id)
        } else {

          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;

            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;

              User.update({ _id: user_id }, { $set: { password: hash } })
                .then(() => {
                  req.flash('success_msg', 'User password updated successfuly');
                  res.redirect('/users/login')
                })
                .catch(err => console.log(err));
            });
          });
        }
      })
      .catch(err => console.log(err));
  }

  function confirmForgotPass(req, res) {
    const { email } = req.body;
    let errors = [];

    validateForgetPassForm(email, errors);

    if (errors.length > 0) {
      res.render('forgot-pass', {
        errors, email
      })
    } else {
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            errors.push({ msg: 'Email provided is not registered' });

            res.render('forgot-pass', {
              errors, email
            });
          }

          res.redirect('/users/forgot-pass/?userId=' + user._id)
        })
        .catch(err => console.log(err));
    }
  }

  return { 
    getLogin, getRegister, saveUser, logoutUser, 
    loginUser, getForgotPass, getForgotPassReset, 
    updatePassword, confirmForgotPass 
  }
}



module.exports = usersController;