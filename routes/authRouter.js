const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const { UserModel } = require("../models/userModel");

router.post("/register", async (_req, res) => {
	const { username, password } = req.body;
	const userExists = await UserModel.exists({ username });

	if (userExists) {
		res.status(422).send("User already exists");
	} else {
		if (password) {
			const hashedPassword = await bcrypt.hash(password, 15);
			const user = new UserModel({
				username,
				password: hashedPassword,
			});

			user
				.save()
				.then(doc => {
					if (doc) {
						res.sendStatus(200);
					}
				})
				.catch(err => {
					res.status(400).send(err.message);
				});
		} else {
			res.status(400).send("Error when creating a user");
		}
	}
});

router.post("/join", async (req, res) => {
	const { username, password } = req.body;
	const userExists = await UserModel.exists({ username });

	if (userExists) {
		if (password.length < 4) {
			res.status(422).send("User already exists");
		} else {
			const user = await UserModel.findOne({ username });
			const passwordCorrect = await bcrypt.compare(password, user.password);

			if (passwordCorrect) {
				res.sendStatus(200);
			} else {
				res.status(401).send("Incorrect password");
			}
		}
	} else {
		res.sendStatus(200);
	}
});

module.exports = router;
