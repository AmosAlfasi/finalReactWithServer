var express = require("express");
const { body, validationResult } = require("express-validator");
const { getUsers } = require("../services/user.service");
const userService = require("../services/user.service");

const router = express.Router();

//Insert new user or updating existing user
router.post(
	"/insert-or-update-user",

	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const { id, firstName, lastName, maritalStatus, birthday } = req.body;

			const user = await userService.createOrUpdateUser(
				id,
				firstName,
				lastName,
				maritalStatus,
				birthday
			);

			res.status(200).send(user);
		} catch (error) {
			console.log(error);
		}
	}
);

//get monthly report of user based on year and month
router.get(
	"/get-monthly-report/:id",
	body("year").exists().isNumeric(),
	body("month")
		.exists()
		.isString()
		.isIn([
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		]),
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const { id } = req.params;
			const { year, month } = req.body;
			console.log(`${id},${year},${month}`);

			const report = await userService.generateMonthlyReport(id, year, month);
			console.log(report);

			res.status(200).send(report);
		} catch (error) {
			console.log(error);
		}
	}
);

router.get("/", async (req, res) => {
	try {
		const result = await getUsers();
		res.status(200).send(result);
	} catch (error) {
		console.log(error);
	}
});

router.post(
	"/delete-user/:id",

	async (req, res) => {
		try {
			const { id } = req.params;

			const users = await userService.deleteUser(id);

			res.status(200).send(users);
		} catch (error) {
			console.log(error);
		}
	}
);

module.exports = router;
