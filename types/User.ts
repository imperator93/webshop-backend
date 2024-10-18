import { ProductType } from "./Product";

export type User = {
	username: string;
	password: string;
	avatar: string;
	cart: { product: ProductType; count: number }[];
	_id?: string;
	__v?: number;
};
