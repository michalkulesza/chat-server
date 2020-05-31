const express = require("express");
const router = express.Router();
const { MessageModel, ChatModel } = require("./models/Models");

router.get("/", (req, res) => {
	res.send("Server is up and running");
});

router.post("/api/getmessages", async (req, res) => {
	const roomName = req.body.roomName;
	const getData = async () => {
		return await ChatModel.findOne({ title: roomName });
	};

	getData().then(data => {
		if (data) {
			res.send(data);
		} else {
			const updatePost = async () => {
				const newChat = new ChatModel({
					title: roomName,
					messages: [],
				});

				return await newChat.save();
			};

			updatePost()
				.then(data => res.send(data).status(200))
				.catch(err => console.error(err));
		}
	});
});
module.exports = router;
