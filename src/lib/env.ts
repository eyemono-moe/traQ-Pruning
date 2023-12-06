import dotenv from "dotenv";

dotenv.config();

const env = (key: string) => {
	const value = process.env[key];
	if (value === undefined) {
		throw new Error(`Missing environment variable ${key}`);
	}
	return value;
};

export default env;
