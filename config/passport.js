const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://dev.aegisight.ai/api/auth/google/callback',
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists with this Google ID
            let user = await User.findByGoogleId(profile.id);

            if (!user) {
                // Check if user exists with this email
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                if (email) {
                    user = await User.findByEmail(email);

                    if (user) {
                        // Update existing user with Google ID
                        user = await User.linkGoogleAccount(user.id, profile.id, profile.photos[0]?.value);
                    } else {
                        // Create new user from Google profile
                        user = await User.createWithGoogle({
                            googleId: profile.id,
                            email: email,
                            firstName: profile.name?.givenName || '',
                            lastName: profile.name?.familyName || '',
                            avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null
                        });
                    }
                } else {
                    throw new Error('No email provided by Google');
                }
            }

            // Update last login
            await User.updateLastLogin(user.id);

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));
} else {
    console.warn('⚠️ Google OAuth credentials missing. Google authentication strategy skipped.');
}

module.exports = passport;
