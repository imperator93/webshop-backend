import mongoose from "mongoose";

const product = new mongoose.Schema({
	name: String,
	img: String,
	categorie: String,
	rating: Number,
	price: String,
	description: String,
});

const Product = mongoose.model("Product", product);

module.exports = Product;
