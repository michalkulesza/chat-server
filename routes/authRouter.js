const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const { UserModel } = require("../models/userModel");

router.post("/register", (req, res) => {
	const { username, password } = req.query;
});

router.post("/join", async (req, res) => {
	const { username, password } = req.query;

	const userExists = await UserModel.exists({ username });

	if (userExists) {
		if (!password) {
			res.send("User already exists").status(422);
		} else {
			const user = await UserModel.findOne({ username });
			const passwordCorrect = await bcrypt.compare(password, user.password);

			if (passwordCorrect) {
				res.sendStatus(200);
			} else {
				res.send("Incorrect password").status(401);
			}
		}
	} else {
		res.sendStatus(200);
	}
});

module.exports = router;
