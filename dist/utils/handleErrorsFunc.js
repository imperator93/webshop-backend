"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
const handleErrors = (err, res) => {
    if (err instanceof Error)
        res.status(500).json({
            message: err.message,
        });
    else
        res.status(400).json({
            message: "unknown error",
        });
};
exports.handleErrors = handleErrors;
