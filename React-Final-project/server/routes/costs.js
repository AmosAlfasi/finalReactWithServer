var express = require("express");
const { body, validationResult } = require("express-validator");
const { getUserCosts } = require("../services/cost.service");
const costService = require("../services/cost.service");
const userService = require("../services/user.service");

const router = express.Router();

//Insert new cost to DB with the require validatos

router.post(
	"/insert",

	async (req, res) => {
		const { description, category, year, month, sum, userId, name } = req.body;

		const newCost = await costService.insertCost(
			description,
			category,
			year,
			month,
			sum,
			userId,
			name
		);

		res.status(200).send(newCost);
	}
);

router.get(
	"/get-user-costs/:id",

	async (req, res) => {
		const { id } = req.params;
		const costs = await getUserCosts(id);

		res.status(200).send(costs);
	}
);

module.exports = router;
