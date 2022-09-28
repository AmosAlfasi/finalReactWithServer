const Cost = require("../models/cost");
const User = require("../models/user");

module.exports = {
	//This method create new cost for user only if this user exist
	async insertCost(name, description, category, year, month, sum, userId) {
		const user = await User.findOne({ id: userId });
		if (!user) {
			console.log(`user with id:${userId} not found`);
			return;
		}
		const newCost = await Cost.create({
			name,
			description,
			category,
			year,
			month,
			sum,
			userId,
		});

		return newCost;
	},

	async getUserCosts(id) {
		return Cost.find({ userId: id.replace("\n", "") });
	},
	async deleteCost(id) {
		await Cost.deleteMany({ userId: id });
	},
};
