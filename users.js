let rooms = [
	{
		name: "main",
		users: [],
	},
];

let usersConnected = [];

const addUserToRoom = (id, username, roomname) => {
	const roomName = roomname.trim().toLowerCase();

	const roomToJoin = rooms.find(room => room.name === roomName);
	const user = { id, username };

	if (roomToJoin) {
		roomToJoin.users = [...roomToJoin.users, user];
		usersConnected = [...usersConnected, user];
	} else {
		const newRoom = {
			name: roomName,
			users: [user],
		};

		rooms = [...rooms, newRoom];
		usersConnected = [...usersConnected, user];
	}
};

const getRoomData = roomName => {
	return rooms.find(room => room.name === roomName);
};

const getUser = id => {
	return usersConnected.find(user => user.id === id);
};

const getUsersRoom = id => {
	return rooms.find(room => room.users.find(user => user.id === id));
};

const removeUserFromRoom = id => {
	const room = rooms.find(room => room.users.find(user => user.id === id));

	if (room) {
		rooms = [
			...rooms,
			{
				...room,
				users: room.users.splice(
					room.users.findIndex(user => user.id === id),
					1
				),
			},
		];
	}
	usersConnected = usersConnected.splice(
		usersConnected.findIndex(user => user.id === id),
		1
	);
};

// const getUser = id => {
// 	return users.find(user => user.id === id);
// };

// const getUsersIdByName = name => {
// 	const user = users.find(user => user.name === name);
// 	if (user) {
// 		return user.id;
// 	}
// };

// const getUsersInRoom = room => {
// 	users.filter(user => user.room === room);
// 	return users;
// };

module.exports = {
	addUserToRoom,
	removeUserFromRoom,
	getRoomData,
	getUser,
	getUsersRoom,

	// removeUser,
	// getUser,
	// getUsersIdByName,
	// getUsersInRoom,
};
