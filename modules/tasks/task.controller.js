import taskModel from '../../DB/models/task.model.js';
import userModel from '../../DB/models/user.model.js';

const addTask = async (req, res) => {
	try {
		const { id } = req.params;
		const { assignTo } = req.body;

		const founded = await userModel.findById({ _id: id });
		const assigningTo = await userModel.findById({ _id: assignTo });

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
			const { title, description, assignTo, deadLine } = req.body;
			let addTask = await taskModel.create({
				title,
				description,
				userId: id,
				assignTo,
				deadLine,
				status: 'todo',
			});
			return res
				.status(200)
				.json({ message: `Task Added to ${assignTo.userName}`, addTask });
		}
	} catch (err) {
		res.status(500).json({ message: 'Error occuring while Adding task', err });
	}
};

const updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		const founded = await userModel.findById({ _id: id });
		if (
			founded &&
			founded.deleted == false &&
			founded.isVerified == true &&
			founded.role == 'admin'
		) {
			const { id, title, description, status } = req.body;
			let update = await taskModel.findById(id);
			if (update) {
				let updatedTask = await taskModel.findByIdAndUpdate(
					{ _id: id },
					{ title, description, status },
					{ new: true }
				);
				return res
					.status(201)
					.json({ message: 'Task Updated Successfully', updatedTask });
			} else {
				return res.status(400).json({ message: 'Task does not exist' });
			}
		} else {
			return res
				.status(402)
				.json({ message: 'You are not authorized to update task' });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error occuring while updating task', err });
	}
};

const deleteTask = async (req, res) => {
	try {
		const { id } = req.params;
		const founded = await userModel.findById({ _id: id });
		if (
			founded &&
			founded.deleted == false &&
			founded.isVerified == true &&
			founded.role == 'admin'
		) {
			const { id } = req.body;
			let deleted = await taskModel.findById({ _id: id });
			if (deleted) {
				let deletedTask = await taskModel.findByIdAndDelete({ _id: id });
				return res.status(201).json({ message: 'Task Deleted', deletedTask });
			} else {
				return res.status(400).json({ message: 'Task not exist' });
			}
		} else {
			return res.status(402).json({ message: 'You dont have a premession' });
		}
	} catch {
		(err) =>
			res
				.status(404)
				.json({ error: 'Something went wrong while updating the task', err });
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
