const { addUserToRoom, removeUserFromRoom, getRoomData, getUsersRoom } = require("../users");

const MSGS = [{ _id: "123", text: "hELLO World", name: "admin", timestamp: "2020-12-01T12:32:46.238Z" }];

const handleSocket = io => {
	io.on("connection", socket => {
		console.log(`socket ${socket.id} connected`);

		socket.on("joinRoom", ({ room, user }) => {
			addUserToRoom(socket.id, user, room);
			socket.join(room, () => {
				const newRoomData = getRoomData(room);

				io.to(room).emit("roomUserData", newRoomData);
				socket.emit("roomChatData", MSGS);
			});
		});

		socket.on("message", ({ text, name, room }) => {
			io.to(room).emit("message", { _id: "22222", text, name, timestamp: new Date().toISOString() });
		});

		socket.on("disconnect", () => {
			console.log(`socket ${socket.id} disconnected`);
			const room = getUsersRoom(socket.id);
			removeUserFromRoom(socket.id);
		});
	});
};

module.exports = handleSocket;
