const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const FacebookStrategy = require("passport-facebook").Strategy
const UserModel = require("../models/User")

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

// 🟢 Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({
          email: profile.emails[0].value,
        })
        console.log({ user })
        if (!user) {
          console.log("Adding new google user to DB..")
          user = new UserModel({
            username: profile.displayName,
            accountId: profile.id,
            name: profile.displayName,
            provider: "google",
            googleId: profile.id,
            email: profile.emails[0].value,
          })
          await user.save()
        } else {
          console.log("Google User already exists in DB..")
          user.googleId = profile.id
          user.accountId = profile.id
          await user.save()
        }
        user.accessToken = accessToken
        return done(null, user)
      } catch (error) {
        console.error("Error in Google Strategy:", error)
        return done(error, null)
      }
    }
  )
)

// 🔵 Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({
          email: profile.emails[0].value,
        })

        if (!user) {
          console.log("Adding new facebook user to DB..")
          user = new UserModel({
            accountId: profile.id,
            name: profile.displayName,
            provider: "facebook",
            facebookId: profile.id,
            email: profile.emails[0].value,
          })
          await user.save()
        } else {
          console.log("Facebook User already exists in DB..")
          user.facebookId = profile.id
          user.accountId = profile.id
          await user.save()
        }
        user.accessToken = accessToken
        return done(null, user)
      } catch (err) {
        console.error("Error in Facebook Strategy:", err)
        return done(err, null)
      }
    }
  )
)

module.exports = passport
