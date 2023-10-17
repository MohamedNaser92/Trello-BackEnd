import taskModel from '../../DB/models/task.model.js';
import userModel from '../../DB/models/user.model.js';

const addTask = async (req, res) => {
	try {
		const { id } = req.params;
		const { assignTo } = req.body;

		const founded = await userModel.findById({ _id: id });
		const assigningTo = await userModel.findOne({ email: assignTo });

		if (!founded && founded.deleted == true && founded.isVerified == false)
			return res
				.status(400)
				.json({ message: 'User Not Founded please signUp' });

		if (founded.role != 'admin')
			return res.status(402).json({ message: 'You dont have a premession' });

		if (!assigningTo)
			return res.status(400).json({
				message: 'User you trying to addmit task to is exist',
			});

		if (assigningTo) {
			const { title, description, assignTo, deadline } = req.body;
			let addTask = await taskModel.create({
				title,
				description,
				userId: id,
				assignTo: assigningTo._id,
				deadline,
				status: 'todo',
			});
			return res
				.status(200)
				.json({ message: `Task Added to ${assigningTo.userName}`, addTask });
		}
	} catch (err) {
		res.status(500).json({ message: 'Error occuring while Adding task', err });
	}
};

const updateTask = async (req, res) => {
	try {
		let user = req.user.id;
		let role = req.user.role;

		let taskID = req.params.id;

		role !== 'admin' &&
			res.status(403).json({ message: "You don't have permission " });
		let taskAutherized = await taskModel.findOne({
			_id: taskID,
			userId: user,
		});

		if (taskAutherized) {
			let updatedTask = await taskModel.findByIdAndUpdate(
				taskID,
				{
					title: req.body.title,
					description: req.body.description,
					status: req.body.status,
					deadline: req.body.deadline,
				},
				{ new: true }
			);
			res
				.status(200)
				.json({ message: 'Task Updated Successfully', updatedTask });
		} else {
			res
				.status(404)
				.json({ message: 'You are not authorized to update task  ' });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error occuring while updating task', err });
	}
};

const deleteTask = async (req, res) => {
	try {
		let user = req.user.id;
		let role = req.user.role;
		let taskID = req.params.id;

		role !== 'admin' &&
			res.status(403).json({ message: "You don't have permission " });
		let taskAutherized = await taskModel.findOne({
			_id: taskID,
			userId: user,
		});
		// console.log(taskAutherized);

		if (taskAutherized) {
			let deletedTask = await taskModel.findByIdAndDelete(taskID);
			// console.log(deletedTask);
			res
				.status(200)
				.json({ message: 'Task deleted successfully.', deletedTask });
		} else {
			res.json({ message: 'You are not authorized to Delete task ' });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error occuring while deleting task', err });
	}
};

const getAllTasksWithUserData = async (req, res) => {
	try {
		// user = await userModel.findById(userId);

		let getAllTasksWithUsersData = await taskModel
			.find()
			.populate('userId', 'userName email role');
		console.log(getAllTasksWithUsersData);
		res.status(200).json({ message: 'All tasks', getAllTasksWithUsersData });
	} catch (err) {
		res.status(500).json({ message: 'Error while getting tasks', err });
	}
};
//

const getallTasksNotDoneAfterDeadline = async (req, res) => {
	let user = req.user.id;
	let role = req.user.role;

	try {
		role !== 'admin' &&
			res.status(403).json({ message: "You don't have permission " });
		let query = req.user.role === 'admin' ? {} : { user };
		console.log(query);
		let tasksDelayed = await taskModel.find({
			...query,
			status: { $ne: 'done' },
			deadline: { $lt: new Date() },
		});
		res.status(200).json({ message: 'Delayed tasks:', tasksDelayed });
	} catch (err) {
		res.status(500).json({ message: 'Error while getting tasks' });
	}
};

export {
	addTask,
	updateTask,
	deleteTask,
	getAllTasksWithUserData,
	getallTasksNotDoneAfterDeadline,
};
