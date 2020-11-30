const { addUserToRoom, removeUserFromRoom, getRoomData, getUsersRoom } = require("../users");
const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");

const handleSocket = socket => {
	console.log(`socket ${socket.id} connected`);

	socket.on("register", async ({ username, password }) => {
		const userExists = await UserModel.exists({ username });

		if (userExists) {
			socket.emit("authUserExists");
		} else {
			if (password) {
				const hashedPassword = await bcrypt.hash(password, 15);
				console.log(hashedPassword);
				const user = new UserModel({
					username,
					password: hashedPassword,
				});

				user
					.save()
					.then(doc => {
						if (doc) {
							socket.emit("authSuccessfull", { registered: true });
						}
					})
					.catch(err => {
						console.log(err.message);
						socket.emit("error", {
							error: "Error when creating a user",
						});
					});
			} else {
				socket.emit("error", {
					error: "Error when creating a user",
				});
			}
		}
	});

	socket.on("joinRoom", ({ room, user }) => {
		addUserToRoom(socket.id, user, room);
		const newRoomData = getRoomData(room);

		socket.emit("roomData", newRoomData);
	});

	socket.on("disconnect", () => {
		console.log(`socket ${socket.id} disconnected`);
		const room = getUsersRoom(socket.id);
		removeUserFromRoom(socket.id);

		// const user = removeUser(socket.id);

		// if (user) {
		// 	io.to(user.room).emit("roomData", {
		// 		room: user.room,
		// 		users: getUsersInRoom(user.room),
		// 	});

		// 	socket.broadcast.to(user.room).emit("message", {
		// 		text: `${user.name} has left.`,
		// 		name: "admin",
		// 	});
		// }
	});
	// socket.on("readyForInitData", initRoom => {
	// 	socket.emit("getData", initRoom);
	// });

	// socket.on("joinChat", ({ roomName }) => {
	// 	socket.join(roomName);
	// 	socket.emit("getData", roomName);
	// });

	// socket.on("leaveChat", () => {
	// 	socket.leaveAll();
	// });

	// socket.on("ready", (name, roomName) => {
	// 	socket.broadcast.to(roomName).emit("message", {
	// 		text: `${name} has joined.`,
	// 		name: "admin",
	// 	});
	// 	socket.emit("message", {
	// 		text: "You have joined.",
	// 		name: "admin",
	// 	});
	// });

	// socket.on("sendMessage", async (message, name, room) => {
	// 	const date = new Date();
	// 	date.setSeconds(0, 0);
	// 	const timeStamp = date.toISOString();

	// 	io.sockets.in(room).emit("message", {
	// 		text: message,
	// 		name,
	// 		timestamp: timeStamp,
	// 		room,
	// 	});

	// 	const aMessage = new MessageModel({
	// 		name: name,
	// 		text: message,
	// 		timestamp: timeStamp,
	// 	});

	// 	aMessage.addMessage(room, aMessage);
	// });
};

module.exports = handleSocket;
