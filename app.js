const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const { MessageModel } = require("./models/Models");
require("./db/db");
require("dotenv").config();

const {
	addUser,
	removeUser,
	getUser,
	getUsersIdByName,
	getUsersInRoom,
} = require("./users");

const PORT = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connect", socket => {
	//ALL GOOD
	socket.on("initJoin", ({ name, initRoom }, callback) => {
		const { error, user } = addUser({ id: socket.id, name, room: initRoom });

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

	socket.on("ready", ({ name, room }) => {
		socket.emit("message", {
			name: "admin",
			text: `${name} welcome to the ${room} room.`,
		});
	});

	socket.on("joinNewChat", roomName => {});

	socket.on("joinChat", roomName => {});

	socket.on("sendMessage", (message, name, callback) => {
		const user = getUser(socket.id);
		const date = new Date();
		date.setSeconds(0, 0);
		const timeStamp = date.toISOString();

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
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type,Authorization"
	);
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

app.use(router);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
