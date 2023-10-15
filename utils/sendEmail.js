import { createTransport } from 'nodemailer';
import jwt from 'jsonwebtoken';
import verificationMail from '../utils/verifyMailTemp.js';
import 'dotenv/config';

export const sendToEmail = async (email, verificationSignUpToken) => {
	const transporter = createTransport({
		service: 'gmail',
		auth: {
			user: process.env.APP_EMAIL,
			pass: process.env.PASSWORD,
		},
	});
	const confLink = `https://trello-application.onrender.com/user/verify/${verificationSignUpToken}`;
	// const confLink = `http://localhost:3000/user/verify/${verificationSignUpToken}`;
	const info = await transporter.sendMail({
		from: '"Trello App 📒"  process.env.APP_EMAIL', // sender address
		to: email, // list of receivers

		subject: 'Trello email verification ✔ 🙋🏻', // Subject line
		text: 'Hello ', // plain text body
		html: verificationMail(confLink),
	});

	console.log('Message sent: %s', info.messageId);
};

// export const verificationSignUpToken = async (userId) => {};
