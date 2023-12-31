import express from 'express';
import connection from './DB/connection.js';
import userRoutes from './modules/users/user.routes.js';
import taskRoutes from './modules/tasks/task.routes.js';
import { config } from 'dotenv';
import cors from 'cors';
config();
const app = express();
app.use(express.json());

connection();

app.options('*', cors());
app.use(
	cors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	})
);

app.use(userRoutes);
app.use(taskRoutes);
app.get('/', (req, res) => {
	res.status(201).json({ message: 'Welcome, Home page' });
});

const port = process.env.PPRT || 3000;

app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
