const userServices = require("../services/user.service");
const { findUser, createUser } = new userServices();
const googleStrategy = require("passport-google-oauth20").Strategy;

const initializeGoogleStrategy = async (passport) => {
  passport.use(
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/api/user/auth/google/callBack",
        //   passReqToCallback: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if profile.emails is defined and has at least one email
          if (!profile.emails || profile.emails.length === 0) {
            return done(new Error("No email found in Google profile"), null);
          }

          const email = profile.emails[0].value; // Safely access the first email

          const existingUser = await findUser({
            email: email,
          });

          if (existingUser) {
            return done(null, existingUser);
          }

          // create new user
          const newGoogleUser = await createUser({
            googleId: profile.id,
            email: email,
            name: profile.displayName,
            provider: "google",
          });
          return done(null, newGoogleUser);
        } catch (error) {
          console.log("Error  in initializeGoogleStrategy => ", error);
          return done(error, null); // Make sure to return the error to the done callback
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUser({ _id: id });
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  });
};

module.exports = { initializeGoogleStrategy };
