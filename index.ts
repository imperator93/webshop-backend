import express, { Express, Request, Response, Errback } from "express";
import dotenv from "dotenv";
import mongoose, { Model } from "mongoose";

import { handleErrors } from "./utils/handleErrorsFunc";
import { CallTracker } from "assert";

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
		else {
			userExists.password = "";
			res.status(200).json({
				userInDatabase: true,
				user: userExists,
			});
		}
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//products GET
app.get("/products", async (req: Request, res: Response) => {
	try {
		const [cars, computers, phones] = await Promise.all([
			Car.find().exec(),
			Computer.find().exec(),
			Phone.find().exec(),
		]);
		res.status(200).json({
			message: "allProducts",
			allProducts: [...cars, ...computers, ...phones],
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

// product POST
const modelMap: Record<string, any> = {
	cars: Car,
	computers: Computer,
	phones: Phone,
};

app.post("/:type/", async (req: Request, res: Response) => {
	const Model = modelMap[req.params.type];

	if (!Model)
		res.status(400).json({
			message: "check your endpoints",
		});

	try {
		const product = await Model.create(req.body);
		res.status(200).json({
			message: `${req.params.type.slice(0, -1)} created`,
			product,
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//comments POST
app.post("/:type/:id", async (req: Request, res: Response) => {
	const Model = modelMap[req.params.type];
	!Model &&
		res.status(400).json({
			message: `${req.params.type} endpoint does not exist`,
		});

	try {
		const product = await Model.findById(req.params.id);
		const newComment = {
			...req.body,
			_id: new mongoose.Types.ObjectId(),
		};
		product.comments.push(newComment);
		await product.save();

		res.status(200).json({
			message: "comment added",
			commentID: newComment._id,
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//comment DELETE  something is wrong here not getting the proper response but its works
app.delete("/:type/:id/:commentID/", async (req: Request, res: Response) => {
	const Model = modelMap[req.params.type];

	if (!Model)
		res.status(404).json({
			message: `${req.params.type} endpoint doesn't exist`,
		});

	try {
		const product = await Model.findById(req.params.id);
		if (!product)
			res.status(404).json({
				message: "product not found",
			});
		else {
			const indexOfcommentToDelete = product.comments.findIndex((comment: any) => comment._id == req.params.commentID);

			if (indexOfcommentToDelete == -1)
				res.status(404).json({
					message: "comment not found",
				});
			else {
				product.comments.splice(indexOfcommentToDelete, 1);
				await product.save();

				res.status(200).json({
					message: "comment deleted",
				});
			}
		}
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});
