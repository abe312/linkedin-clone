const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateExperienceInput(data) {
  let errors = {};
  let { school, field, degree, from } = data;

  school = !isEmpty(school) ? school : '';
  field = !isEmpty(field) ? field : '';
  degree = !isEmpty(degree) ? degree : '';
  from = !isEmpty(from) ? from : '';

  function isRequired(str, item) {
    if (Validator.isEmpty(item)) {
      errors[str] = `${str} is required`;
    }
  }

  isRequired('school', school);
  isRequired('field', field);
  isRequired('degree', degree);
  isRequired('from', from);

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
