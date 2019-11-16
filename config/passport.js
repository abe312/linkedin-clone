const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      // console.log(jwt_payload);
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) return done(null, user); // null is error
        return done(null, false);
      } catch (err) {
        console.error(err);
      }
    }),
  );
};
