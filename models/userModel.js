const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: String,
	password: String,
});

userSchema.methods.addUser = async ({ username, password }) => {
	try {
		await UserModel.updateOne({
			username,
			password,
		});
	} catch (error) {
		console.log(error.message);
	}
};

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
