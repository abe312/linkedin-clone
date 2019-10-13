const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validatePostInput(data) {
  let errors = {};
  let { text } = data;

  text = !isEmpty(text) ? text : '';

  function isRequired(str, item) {
    if (Validator.isEmpty(item)) {
      errors[str] = `Profile ${str} is required`;
    }
  }

  isRequired('text', text);

  if (!Validator.isLength(text, { min: 10, max: 300 })) {
    errors.text = 'post must be between 10 and 300 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
