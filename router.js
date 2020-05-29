const express = require("express");
const router = express.Router();
const { MessageModel, ChatModel } = require("./models/Models");

router.get("/", (req, res) => {
	res.send("Server is up and running");
});

router.get("/api/getmessages", async (req, res) => {
	const data = await ChatModel.findOne({ title: "Main" }, (err, res) => {
		if (err) {
			console.error(err);
		} else {
			return res;
		}
	});
	res.send(data.messages);
});
module.exports = router;
