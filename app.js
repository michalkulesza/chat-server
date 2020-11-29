require("dotenv").config();
const express = require("express");
const socketio = require("socket.io");
const encrypt = require("socket.io-encrypt");
const http = require("http");
const router = require("./router");

// const { MessageModel } = require("./models/Models");

require("./db/db");

// const { addUser, removeUser, getUser, getUsersIdByName, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
io.use(encrypt("secret"));

io.on("connect", socket => {
	console.log("Socket Connected");

	socket.on("join", ({ username }) => {
		console.log(`${username} has joined.`);

		socket.emit("authSuccessfull");
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

	// socket.on("disconnect", () => {
	// 	const user = removeUser(socket.id);

	// 	if (user) {
	// 		io.to(user.room).emit("roomData", {
	// 			room: user.room,
	// 			users: getUsersInRoom(user.room),
	// 		});

	// 		socket.broadcast.to(user.room).emit("message", {
	// 			text: `${user.name} has left.`,
	// 			name: "admin",
	// 		});
	// 	}
	// });
});

app.use(express.json());
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");
	next();
});

app.use(router);
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
