exports.catchErrors = fn => {
  try {
    return fn;
  } catch (e) {
    console.log('catchErrors', e);
  }
};
