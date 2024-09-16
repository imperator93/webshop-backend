"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const handleErrorsFunc_1 = require("./utils/handleErrorsFunc");
const fullProofDecryption_1 = require("./utils/fullProofDecryption");
const User = require("./model/User.model");
const { Car, Computer, Phone } = require("./model/Product.model");
const app = (0, express_1.default)();
const cors = require("cors");
const port = process.env.PORT || 3000;
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(cors());
mongoose_1.default.connect(`${process.env.DATABASE}`).then(() => {
    console.log("db connected");
    app.listen(port, () => {
        console.log(`server running on port ${port}`);
    });
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            message: "hello from server",
        });
    }
    catch (err) {
        (0, handleErrorsFunc_1.handleErrors)(err, res);
    }
}));
//register user
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExist = yield User.findOne({ username: req.body.username });
        if (userExist)
            res.status(200).json({
                message: `User already exists`,
            });
        else {
            const user = yield User.create(req.body);
            res.status(200).json({
                message: `User ${user} created`,
            });
        }
    }
    catch (err) {
        (0, handleErrorsFunc_1.handleErrors)(err, res);
    }
}));
//login
app.post("/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield User.findOne({ username: req.body.username });
        if (!userExists)
            res.status(200).json({
                message: "User not found",
            });
        else if (userExists.password == (0, fullProofDecryption_1.fullProofDecryption)(req.body.password)) {
            userExists.password = "";
            res.status(200).json({
                userInDatabase: true,
                user: userExists,
            });
        }
        else
            res.status(200).json({
                message: "WRONG PASSWORD INTRUDER!!!",
            });
    }
    catch (err) {
        (0, handleErrorsFunc_1.handleErrors)(err, res);
    }
}));
//products GET
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [cars, computers, phones] = yield Promise.all([
            Car.find().exec(),
            Computer.find().exec(),
            Phone.find().exec(),
        ]);
        res.status(200).json({
            message: "allProducts",
            allProducts: [...cars, ...computers, ...phones],
        });
    }
    catch (err) {
        (0, handleErrorsFunc_1.handleErrors)(err, res);
    }
}));
// product POST
const modelMap = {
    cars: Car,
    computers: Computer,
    phones: Phone,
};
app.post("/:type/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Model = modelMap[req.params.type];
    if (!Model)
        res.status(400).json({
            message: "check your endpoints",
        });
    try {
        const product = yield Model.create(req.body);
        res.status(200).json({
            message: `${req.params.type.slice(0, -1)} created`,
            product,
        });
    }
    catch (err) {
        (0, handleErrorsFunc_1.handleErrors)(err, res);
    }
}));
//comments POST
app.post("/:type/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Model = modelMap[req.params.type];
    !Model &&
        res.status(400).json({
            message: `${req.params.type} endpoint does not exist`,
        });
    try {
        const product = yield Model.findById(req.params.id);
        const newComment = Object.assign(Object.assign({}, req.body), { _id: new mongoose_1.default.Types.ObjectId() });
        product.comments.push(newComment);
        yield product.save();
        res.status(200).json({
            message: "comment added",
            commentID: newComment._id,
        });
    }
    catch (err) {
        (0, handleErrorsFunc_1.handleErrors)(err, res);
    }
}));
//comment DELETE  something is wrong here not getting the proper response but its works
app.delete("/:type/:id/:commentID/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Model = modelMap[req.params.type];
    if (!Model)
        res.status(404).json({
            message: `${req.params.type} endpoint doesn't exist`,
        });
    try {
        const product = yield Model.findById(req.params.id);
        if (!product)
            res.status(404).json({
                message: "product not found",
            });
        else {
            const indexOfcommentToDelete = product.comments.findIndex((comment) => comment._id == req.params.commentID);
            if (indexOfcommentToDelete == -1)
                res.status(404).json({
                    message: "comment not found",
                });
            else {
                product.comments.splice(indexOfcommentToDelete, 1);
                yield product.save();
                res.status(200).json({
                    message: "comment deleted",
                });
            }
        }
    }
    catch (err) {
        (0, handleErrorsFunc_1.handleErrors)(err, res);
    }
}));
