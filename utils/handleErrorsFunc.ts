import { Response } from "express";

export const handleErrors = (err: unknown, res: Response) => {
	if (err instanceof Error)
		res.status(500).json({
			message: err.message,
		});
	else
		res.status(400).json({
			message: "unknown error",
		});
};
