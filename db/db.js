const mongoose = require("mongoose");
require("dotenv").config();

console.log(process.env.MONGODB_URL);

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
