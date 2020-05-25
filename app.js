const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");

require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
