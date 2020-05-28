const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connect", socket => {
	socket.on("join", ({ name, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, name, room });

		if (error) return callback(error);

		socket.emit("message", {
			name: "admin",
			text: `${user.name} welcome to the "${user.room}" room `,
		});
		socket.broadcast
			.to(user.room)
			.emit("message", { name: "admin", text: `${user.name} has joined` });

		socket.join(user.room);

		io.to(user.room).emit("roomData", {
			room: user.room,
			users: getUsersInRoom(user.room),
		});

		callback();
	});

	socket.on("sendMessage", (message, name, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit("message", {
			text: message,
			name,
			timestamp: new Date().toISOString(),
		});

		io.to(user.room).emit("roomData", {
			room: user.room,
			users: getUsersInRoom(user.room),
		});

		callback();
	});

	socket.on("disconnect", () => {
		const user = removeUser(socket.id);

		if (user) {
			io.to(user.room).emit("roomData", {
				room: user.room,
				users: getUsersInRoom(user.room),
			});

			io.to(user.room).emit("message", {
				name: "admin",
				text: `${user.name} has left.`,
			});
		}
	});
});

app.use(router);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
