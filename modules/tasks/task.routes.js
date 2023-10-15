import express from 'express';
import {
	addTask,
	updateTask,
	deleteTask,
	getAllTasksWithUserData,
	getallTasksNotDoneAfterDeadline,
} from './task.controller.js';
import { auth } from '../../middleware/authentication.js';

const taskRoutes = express.Router();

taskRoutes.post('/task/addTask/:id', auth, addTask);
taskRoutes.post('/task/updateTask/:id', auth, updateTask);
taskRoutes.delete('/task/deleteTask/:id', auth, deleteTask);
taskRoutes.get('/task/getAllTasksWithUsersData', auth, getAllTasksWithUserData);
taskRoutes.get('/task/getaDelayedTasks', auth, getallTasksNotDoneAfterDeadline);

export default taskRoutes;
