const mongoose = require("mongoose");

//the cost must contain desription,category,year,month and sum
const costSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			enum: [
				"food",
				"health",
				"sport",
				"housing",
				"transportation",
				"education",
			],
			required: true,
		},
		year: { type: Number, required: true },

		month: {
			type: String,
			enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
			required: true,
		},
		name: {
			type: String,

			required: true,
		},

		sum: {
			type: Number,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Cost = mongoose.model("Cost", costSchema);

module.exports = Cost;
