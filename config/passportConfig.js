// config/passportConfig.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

async function configurePassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log('Attempting to authenticate user:', username);

        const user = await UserModel.findOne({ username: username });

        if (!user) {
          console.log('User not found:', username);
          return done(null, false, { message: "Incorrect username." });
        }

        console.log('User found:', user);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          console.log('Incorrect password for user:', username);
          console.log('Input password:', password);
          console.log('Stored hashed password:', user.password);
          return done(null, false, { message: "Incorrect password." });
        }

        console.log('User authenticated successfully:', username);
        return done(null, user);
      } catch (error) {
        console.error('Error during authentication:', error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = configurePassport;
