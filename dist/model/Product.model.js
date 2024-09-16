"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const product = new mongoose_1.default.Schema({
    image: String,
    name: String,
    price: String,
    rating: Number,
    description: String,
    comments: [
        {
            content: String,
            fromUser: { avatar: String, username: String },
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
const Car = mongoose_1.default.model("Car", car);
const Computer = mongoose_1.default.model("Computer", computer);
const Phone = mongoose_1.default.model("Phone", phone);
module.exports = { Car, Computer, Phone };
