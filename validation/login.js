const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateLoginInput(data) {
  let errors = {};
  let { email, password } = data;
  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  console.log('email', email);
  console.log('password', password);

  if (!Validator.isEmail(email)) {
    errors.email = 'email is invalid';
  }
  if (Validator.isEmpty(email)) {
    errors.email = 'email field is required';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
