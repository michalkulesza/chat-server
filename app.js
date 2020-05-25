const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connect", socket => {
	console.log("User connected");

	socket.on("disconnect", () => {
		console.log("User disconnected");
	});
});

app.use(router);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
