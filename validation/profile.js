const isEmpty = require('./is-empty');
const Validator = require('validator');
var errors = {};
module.exports = function validateProfileInput(data) {
  let { handle, status, skills, website } = data;

  function isRequired(str, item) {
    if (Validator.isEmpty(item)) {
      errors[str] = `Profile ${str} is required`;
    }
  }

  function checkURL(str, item) {
    if (!isEmpty(item)) {
      if (!Validator.isURL(item)) {
        errors[str] = `${item} is not a valid URL`;
      } else delete errors[str];
    }
  }

  handle = !isEmpty(handle) ? handle : '';
  status = !isEmpty(status) ? status : '';
  skills = !isEmpty(skills) ? skills : '';

  if (!Validator.isLength(handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 40 characters';
  }

  isRequired('handle', handle);
  isRequired('status', status);
  isRequired('skills', skills);

  if (website) checkURL('website', website);

  let { youtube, twitter, instagram, facebook } = data;
  youtube = !isEmpty(youtube) ? youtube : '';
  facebook = !isEmpty(facebook) ? facebook : '';
  twitter = !isEmpty(twitter) ? twitter : '';
  instagram = !isEmpty(instagram) ? instagram : '';
  checkURL('youtube', youtube);
  checkURL('facebook', facebook);
  checkURL('twitter', twitter);
  checkURL('instagram', instagram);

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
