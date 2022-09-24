const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users");
const costs = require("./routes/costs");
const cors = require("cors");

const app = express();

//Parsing incoming json data request
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Load API routes
app.use("/users", users);
app.use("/costs", costs);

//connecting the app to MongoDb
mongoose.connect(
	"mongodb+srv://diana:Dk318402161@users.cetqw.mongodb.net/?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => console.log("Mongoose is connected")
);

// Start the server
app.listen(1500, () => {
	console.log(`App listening on port 1500`);
});
