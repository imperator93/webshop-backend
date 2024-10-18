import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { handleErrors } from "./utils/handleErrorsFunc";
import { fullProofDecryption } from "./utils/fullProofDecryption";
import { TrueQuestions } from "./model/TrueQuestions";
import { Product } from "./types/Product";

const Question = require("./model/Question.model");
const User = require("./model/User.model");
const { Car, Computer, Phone } = require("./model/Product.model");

const app = express();
const cors = require("cors");

const port = process.env.PORT || 4000;

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose.connect(`${process.env.DATABASE}`).then(() => {
	console.log("db connected");
	app.listen(port, () => {
		console.log(`server running on port ${port}`);
	});
});

//initial server response
app.get("/", async (req: Request, res: Response) => {
	try {
		res.status(200).json({
			flag: true,
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
app.post("/users/login", async (req: Request, res: Response) => {
	try {
		const userExists = await User.findOne({ username: req.body.username });
		if (!userExists)
			res.status(200).json({
				message: "User not found",
			});
		else if (userExists.password == fullProofDecryption(req.body.password)) {
			userExists.password = "";
			res.status(200).json({
				userInDatabase: true,
				user: userExists,
			});
		} else
			res.status(200).json({
				message: "WRONG PASSWORD INTRUDER!!!",
			});
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

app.post("/products/:type", async (req: Request, res: Response) => {
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

//USER CART
//add item to cart
app.post("/users/:userID/user-cart", async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.userID);
		if (user) {
			user.cart.push(req.body);
			await user.save();
			res.status(200).json({
				message: "item added",
				item: req.body,
			});
		} else
			res.status(400).json({
				message: "user not found",
			});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//delete item from cart
app.delete("/users/:userID/user-cart/:itemID", async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.userID);
		const item = (user.cart as { product: Product; count: number }[]).find(
			(item) => item.product._id == req.params.itemID
		);
		const removedItemArr = user.cart.splice(user.cart.indexOf(item), 1);
		res.status(200).json({
			message: "ok",
			item: removedItemArr,
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//update cart item count
app.put("/users/:userID/user-cart", async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.userID);
		if (user)
			res.status(200).json({
				message: "userFound",
			});
		else
			res.status(400).json({
				message: "user not found",
			});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

// COMMENTS
// POST
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

// MILLIONAIRE
app.get("/question", async (req: Request, res: Response) => {
	try {
		const questions = await Question.find({});
		res.status(200).json({
			questions,
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

app.post("/question", async (req: Request, res: Response) => {
	try {
		await Question.create(req.body);
		res.status(200).json({
			message: "created",
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

//trueQuestions
app.get("/true-question", async (req: Request, res: Response) => {
	try {
		const questions = await TrueQuestions.find({});
		res.status(200).json({
			questions,
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});

app.post("/true-question", async (req: Request, res: Response) => {
	try {
		await TrueQuestions.create(req.body);
		res.status(200).json({
			message: "successfully created questions",
		});
	} catch (err: unknown) {
		handleErrors(err, res);
	}
});
