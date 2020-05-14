module.exports = {
  validateRegistrationForm: function (name, email, password, password_confirm, errors) {
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
  },
  
  validateForgetPassForm: function(email, errors) {
    if (!email) {
      errors.push({ msg: 'Please fill the email field' });
    }
  
    if (!validateEmail(email)) {
      errors.push({ msg: 'Please provide a valid email address' });
    }
  },

  validateResetPassForm: function(password, password_confirm, errors) {
    if (!password || !password_confirm) {
      errors.push({ msg: 'Please fill all the fields' });
    }

    if (password_confirm !== password) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password should be at least 6 characters' });
    }
  }
}

function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
}
