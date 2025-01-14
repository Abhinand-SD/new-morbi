const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userSchema = require("../model/userModel")
const env = require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/user/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userSchema.findOne({ googleId: profile.id });
            if  (user) {
                return done(null, user);
            } else {
                user = await userSchema({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    isVerified:true
                });
                await user.save();
                return done(null, user);
            }
        } catch (error) {
            return done(error, null);
        }
    }

));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    userSchema.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});


module.exports = passport;