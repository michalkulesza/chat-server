const { addUserToRoom, removeUserFromRoom, getRoomData, getUsersRoom, getUser } = require("../users");

const MSGS = [{ _id: "123", text: "hELLO World", name: "admin", timestamp: "2020-12-01T12:32:46.238Z" }];

const handleSocket = io => {
	io.on("connection", socket => {
		console.log(`socket ${socket.id} connected`);

		socket.on("joinRoom", ({ room, user }) => {
			addUserToRoom(socket.id, user, room);
			socket.join(room, () => {
				const newRoomData = getRoomData(room);

				io.to(room).emit("roomUserData", newRoomData);
				socket.to(room).emit("message", { text: `${user} joined`, name: "admin", timestamp: new Date().toISOString() });

				socket.emit("roomChatData", MSGS);
				socket.emit("message", {
					text: `${user} welcome to ${room} room`,
					name: "admin",
					timestamp: new Date().toISOString(),
				});
			});
		});

		socket.on("message", ({ text, name, room }) => {
			io.to(room).emit("message", { _id: "22222", text, name, timestamp: new Date().toISOString() });
		});

		socket.on("disconnect", () => {
			console.log(`socket ${socket.id} disconnected`);

			const user = getUser(socket.id);
			const userRoom = getUsersRoom(socket.id);

			if (user && userRoom) {
				removeUserFromRoom(socket.id);
				const newRoomData = getRoomData(userRoom.name);
				io.to(userRoom.name).emit("roomUserData", newRoomData);
				socket
					.to(userRoom.name)
					.emit("message", { text: `${user.username} left`, name: "admin", timestamp: new Date().toISOString() });
			}
		});
	});
};

module.exports = handleSocket;
