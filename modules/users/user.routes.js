import express from 'express';
import session from 'express-session';

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
	continueWithGoogle,
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

userRoutes.post('/continugoogle', continueWithGoogle);

export default userRoutes;
