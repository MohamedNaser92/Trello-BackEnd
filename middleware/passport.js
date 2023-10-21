import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from 'dotenv';
import userModel from '../DB/models/user.model.js';

config();

const callbackURL =
	process.env.NODE_ENV === 'production'
		? process.env.PROD_URL + '/auth/google/callback'
		: process.env.BASE_URL + '/auth/google/callback';

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL,
			scope: ['profile'],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				console.log('Google profile data:', profile);

				if (!profile.emails || profile.emails.length === 0) {
					return done(null, false, {
						message: 'No email found in Google profile.',
					});
				}

				const email = profile.emails[0].value;

				const existingUser = await userModel.findOne({ email });

				if (existingUser) {
					// console.log('user is: ', existingUser);
					return done(null, existingUser);
				} else {
					const newUser = await userModel.create({
						googleId: profile.id,
						email,
						userName: profile.displayName,
						isVerified: true,
					});

					// Call done with the new user.
					return done(null, newUser);
				}
			} catch (err) {
				return done(err); // Handle the error appropriately
			}
		}
	)
);

// Serialize and deserialize user functions
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	userModel
		.findById(id)
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			done(err, null);
		});
});

export default passport;
