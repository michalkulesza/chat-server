require("dotenv").config();
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const encrypt = require("socket.io-encrypt");
const http = require("http");

const handleSocket = require("./socketio");
const authRouter = require("./routes/authRouter");
require("./db/db");

const PORT = process.env.PORT || 5001;
const app = express();

app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");
	next();
});

app.use("/auth", authRouter);

const server = http.createServer(app);
const io = socketio(server);

io.use(encrypt(process.env.SOCKET_SECRET));
io.on("connect", socket => handleSocket(socket));

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
