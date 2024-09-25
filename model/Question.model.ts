import mongoose from "mongoose";

export const question = new mongoose.Schema({
	num: Number,
	content: String,
	isCurrentQuestion: Boolean,
	answers: [
		{ content: String, isCorrect: Boolean },
		{ content: String, isCorrect: Boolean },
		{ content: String, isCorrect: Boolean },
		{ content: String, isCorrect: Boolean },
	],
});

const Question = mongoose.model("Question", question);

module.exports = Question;
