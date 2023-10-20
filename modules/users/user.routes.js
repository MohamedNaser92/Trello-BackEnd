import express from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken';

import {
	signUp,
	verifyEmail,
	signIn,
	getAllUsers,
	changePassword,
	updateUser,
	deleteUser,
	softDeleteUser,
	logout,
} from './user.controller.js';
import validation from '../../middleware/validation.js';
import {
	signUpValidationScema,
	signInValidationShcema,
	changePasswordValidationSchema,
	updateUserValidationSchema,
} from './user.validation.js';
import {
	authUser,
	auth,
	authVerificationSignUp,
} from '../../middleware/authentication.js';
import passport from '../../middleware/passport.js';
import { config } from 'dotenv';
config();
const userRoutes = express.Router();

userRoutes.use(
	session({
		secret: 'AAAA',
		resave: false,
		saveUninitialized: true,
	})
);

userRoutes.use(passport.initialize());
userRoutes.use(passport.session());

userRoutes.post('/signup', validation(signUpValidationScema), signUp);

userRoutes.get('/user', getAllUsers);
userRoutes.get(
	'/user/verify/:verificationSignUpToken',
	authVerificationSignUp,
	verifyEmail
);

userRoutes.post('/signin', validation(signInValidationShcema), signIn);

userRoutes.patch(
	'/user/changePassword/:id',
	authUser,
	validation(changePasswordValidationSchema),
	changePassword
);

userRoutes.patch(
	'/user/updateUser/:id',
	authUser,
	validation(updateUserValidationSchema),
	updateUser
);

userRoutes.delete('/user/deleteUser/:id', authUser, deleteUser);

userRoutes.put('/user/softDeleteUser/:id', authUser, softDeleteUser);
userRoutes.post('/logout/:id', authUser, logout);

userRoutes.get(
	'/google',
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'],
	})
);
// userRoutes.get(
// 	'/auth/google',
// 	passport.authenticate('google', {
// 		scope: ['https://www.googleapis.com/auth/plus.login', 'profile'],
// 	})
// );

userRoutes.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failure', // Redirect to the login route on authentication failure
	}),
	(req, res) => {
		const token = jwt.sign(req.user.id, 'signInToken');
		const baseUrl =
			process.env.NODE_ENV === 'production'
				? process.env.PROD_URL
				: process.env.BASE_URL;
		res.redirect(baseUrl + '/google-callback?token=' + token);
	}
);

export default userRoutes;
// userRoutes.get(
// 	'/auth/google/callback',
// 	passport.authenticate('google', {
// 		failureRedirect: '/failure', // Redirect to the login route on authentication failure
// 	}),
// 	(req, res) => {
// 		// You can create a JWT token here based on the authenticated user
// 		const token = jwt.sign(req.user.id, 'signInToken'); // Assuming you have a function to generate the JWT token
// 		// Return the token to the client
// 		res.json({ message: 'Google sign-in successful', token });
// 	}
// );
// userRoutes.get(
// 	'/auth/google',
// 	passport.authenticate('google', {
// 		scope: ['https://www.googleapis.com/auth/plus.login', 'email'],
// 	})
// );
