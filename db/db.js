const mongoose = require("mongoose");

mongoose
	.connect(
		"mongodb+srv://xxcuzzme:gpjiwgH6VDBdKqXD@cluster0-awfpb.mongodb.net/chat?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		}
	)
	.then(console.log("✅ MongoDB Connected"))
	.catch(err => {
		console.log("❌ MongoDB Error");
	});
