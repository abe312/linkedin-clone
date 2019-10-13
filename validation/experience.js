const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateExperienceInput(data) {
  let errors = {};
  let { title, company, from } = data;

  title = !isEmpty(title) ? title : '';
  company = !isEmpty(company) ? company : '';
  from = !isEmpty(from) ? from : '';

  function isRequired(str, item) {
    if (Validator.isEmpty(item)) {
      errors[str] = `Profile ${str} is required`;
    }
  }

  isRequired('title', title);
  isRequired('company', company);
  isRequired('from', from);

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
