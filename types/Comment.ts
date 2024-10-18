import { User } from "./User";

export type Comment = {
	content: string;
	fromUser: Pick<User, "avatar" | "username">;
	date: string;
	_id?: string;
	__v?: number;
};
