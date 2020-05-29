const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const { MessageModel } = require("./models/Models");
require("./db/db");

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
		socket.join(user.room);

		io.to(user.room).emit("roomData", {
			room: user.room,
			users: getUsersInRoom(user.room),
		});

		socket.broadcast
			.to(user.room)
			.emit("message", { name: "admin", text: `${user.name} has joined` });

		callback();
	});

	socket.on("joinUser", ({ name, partnersName }, callback) => {
		const sharedRoom = `${name}${partnersName}`;

		socket.join(sharedRoom);

		socket.broadcast.to(sharedRoom).emit("message", {
			name: "admin",
			text: `${name} has joined chat with ${partnersName}`,
		});

		console.log(`${name} has joined chat with ${partnersName}`);

		callback();
	});

	socket.on("ready", ({ name, room }) => {
		socket.emit("message", {
			name: "admin",
			text: `${name} welcome to the ${room} room.`,
		});
	});

	socket.on("sendMessage", (message, name, callback) => {
		const user = getUser(socket.id);
		const timeStamp = new Date().toISOString();

		io.to(user.room).emit("message", {
			text: message,
			name,
			timestamp: timeStamp,
		});

		const aMessage = new MessageModel({
			name: name,
			text: message,
			timestamp: timeStamp,
		});

		aMessage.addMessage(user.room, aMessage);
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

app.use(express.json());

app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

	// Request methods you wish to allow
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);

	// Request headers you wish to allow
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type,Authorization"
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader("Access-Control-Allow-Credentials", true);

	// Pass to next layer of middleware
	next();
});

app.use(router);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
