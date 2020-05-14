const bcrypt = require('bcryptjs');

function usersController(User) {
  function saveUser(req, res) {
    const { name, email, password, password_confirm } = req.body;
    let errors = [];

    // validations
    validateRegistrationForm(name, email, password, password_confirm, errors);

    if (errors.length > 0) {
      res.status(400);

      return res.json({ errors, name, email, password, password_confirm });
    } else {
      User.findOne({ email: email })
        .then(user => {
          if (user) {
            errors.push({ msg: 'Email is already registered' });
            res.status(400);
            return res.json({ errors, name, email, password, password_confirm });
          } else {
            const newUser = new User({
              name, email, password
            });

            bcrypt.genSalt(10, (err, salt) => {
              if (err) throw err;

              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                // hashed password
                newUser.password = hash;
                // save user
                newUser.save()
                  .then(user => {
                    // req.flash('success_msg', 'You are now registered and can log in');
                    res.status(201);
                    // res.redirect('/users/login')
                    return res.json({ user });
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        })
        .catch(err => console.log(err));
    }
  }

  return { saveUser }
}


// Helpers
function validateRegistrationForm(name, email, password, password_confirm, errors) {
  if (!name || !email || !password || !password_confirm) {
    errors.push({ msg: 'Please fill all the fields' });
  }

  if (!validateEmail(email)) {
    errors.push({ msg: 'Please provide a valid email address' });
  }

  if (password_confirm !== password) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }
}

function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
}

module.exports = usersController;