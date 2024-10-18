import mongoose from "mongoose";
const { Car, Computer, Phone } = require("./Product.model");

const user = new mongoose.Schema({
	username: String,
	password: String,
	avatar: String,
	cart: [{ count: Number, product: {} }],
});

const User = mongoose.model("User", user);

module.exports = User;
