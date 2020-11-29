require("dotenv").config();
const mongoose = require("mongoose");

mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(console.log("✅ MongoDB Connected"))
	.catch(err => {
		console.log("❌ MongoDB Error");
		console.error(err);
	});
