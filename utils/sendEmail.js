import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import verificationMail from '../utils/verifyMailTemp.js';
import 'dotenv/config';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	'https://developers.google.com/oauthplayground' // Redirect URL
);
oauth2Client.setCredentials({
	refresh_token: process.env.REFRESH_TOKEN,
});
const accessToken = oauth2Client.getAccessToken();

export const sendToEmail = async (email, verificationSignUpToken) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.APP_EMAIL,
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			refreshToken: process.env.REFRESH_TOKEN,
			accessToken: accessToken,
		},
	});

	const confLink = `https://trello-application.onrender.com/user/verify/${verificationSignUpToken}`;
	// const confLink = `http://localhost:3000/user/verify/${verificationSignUpToken}`;
	const info = await transporter.sendMail({
		from: `"Trello App 📒" <${process.env.APP_EMAIL}>`,
		// sender address
		to: email, // list of receivers

		subject: 'Trello email verification ✔ 🙋🏻', // Subject line
		text: 'Hello ', // plain text body
		html: verificationMail(confLink),
	});

	console.log('Message sent: %s', info.messageId);
};

// export const verificationSignUpToken = async (userId) => {};
