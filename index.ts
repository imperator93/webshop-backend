import express, { Express, Request, Response, Errback } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { handleErrors } from "./utils/handleErrorsFunc";

const User = require("./model/User.model");
const { Car, Computer, Phone } = require("./model/Product.model");

const app = express();
const cors = require("cors");

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose
	.connect(
		`mongodb+srv://leo-binbauer:${process.env.DATABASE_KEY}@millionaire-questions.ubtzv.mongodb.net/webshop?retryWrites=true&w=majority&appName=millionaire-questions`
	)
	.then(() => {
		console.log("db connected");
		app.listen(3000, () => {
			console.log("server running on port 3000");
		});
	});

app.get("/", async (res: Response) => {
	try {
		res.status(200).json({
			message: "hello from server",
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//register user
app.post("/users", async (req: Request, res: Response) => {
	try {
		const userExist = await User.findOne({ username: req.body.username });
		if (userExist)
			res.status(200).json({
				message: `User already exists`,
			});
		else {
			const user = await User.create(req.body);
			res.status(200).json({
				message: `User ${user} created`,
			});
		}
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//login
app.get("/users/:username", async (req: Request, res: Response) => {
	try {
		const userExists = await User.findOne({ username: req.params.username });
		if (!userExists)
			res.status(200).json({
				message: "User not found",
			});
		else
			res.status(200).json({
				userInDatabase: true,
				user: userExists,
			});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//products GET
app.get("/products", async (req: Request, res: Response) => {
	try {
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

// car POST
app.post("/cars/", async (req: Request, res: Response) => {
	try {
		const car = await Car.create(req.body);
		res.status(200).json({
			message: "car created",
			car,
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//computer POST
app.post("/computers/", async (req: Request, res: Response) => {
	try {
		const computer = await Computer.create(req.body);
		res.status(200).json({
			message: "computer created",
			computer,
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//phone POST
app.post("/phones/", async (req: Request, res: Response) => {
	try {
		const phone = await Phone.create(req.body);
		res.status(200).json({
			message: "phone created",
			phone,
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});
