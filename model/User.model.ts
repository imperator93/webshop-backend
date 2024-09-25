import mongoose from "mongoose";

const user = new mongoose.Schema({
	username: String,
	password: String,
	avatar: String,
});

const User = mongoose.model("User", user);

module.exports = User;
