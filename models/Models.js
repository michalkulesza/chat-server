const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	name: String,
	text: String,
	timestamp: String,
});

const chatSchema = new Schema({
	title: String,
	messages: Array,
});

messageSchema.methods.addMessage = async (room, message) => {
	const updatePost = async () => {
		await ChatModel.updateOne(
			{ title: room },
			{
				$push: {
					messages: message,
				},
			}
		);
	};

	updatePost().catch(err => console.error(err));
};

messageSchema.methods.getMessages = async () => {
	ChatModel.find({ title: "Main" }, (err, res) => {
		return res[0].messages;
	});
};

const ChatModel = mongoose.model("chat", chatSchema);
const MessageModel = mongoose.model("message", messageSchema);

module.exports = { MessageModel, ChatModel };
