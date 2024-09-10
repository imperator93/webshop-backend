import mongoose from "mongoose";

const product = new mongoose.Schema({
	image: String,
	name: String,
	price: String,
	rating: Number,
	description: String,
	comments: [
		{
			content: String,
			avatar: String,
			username: String,
			date: String,
		},
	],
});

const car = product.clone();

car.add({
	type: { type: String, default: "car" },
	model: String,
	year: Number,
});

const computer = product.clone();

computer.add({
	type: { type: String, default: "computer" },
	cpu: String,
	gpu: String,
});

const phone = product.clone();

phone.add({
	type: { type: String, default: "phone" },
	model: String,
	year: Number,
});

const Car = mongoose.model("Car", car);
const Computer = mongoose.model("Computer", computer);
const Phone = mongoose.model("Phone", phone);

module.exports = { Car, Computer, Phone };
