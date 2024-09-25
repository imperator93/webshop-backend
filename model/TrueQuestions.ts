import mongoose from "mongoose";

export const trueQuestions = new mongoose.Schema({
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

export const TrueQuestions = mongoose.model("TrueQuestions", trueQuestions);
