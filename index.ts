import express, { Express, Request, Response, Errback } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const User = require("./model/User.model");
const app = express();
const cors = require("cors");

dotenv.config();
app.use(express.json());
app.use(cors());

const handleErrors = (err: unknown, res: Response) => {
	if (err instanceof Error)
		res.status(500).json({
			message: err.message,
		});
	else
		res.status(400).json({
			message: "unknown error",
		});
};

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

app.get("/", async (req, res) => {
	try {
		res.status(200).json({
			message: "hello from server",
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

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
