import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS = {
	MONGO_URI: process.env.MONGO_URI ?? "mongodb://localhost:27017/ecommerce",
	PORT: process.env.PORT || 5000,
	JWT_SECRET: process.env.JWT_SECRET,
	NODE_ENV: process.env.NODE_ENV,
    CLOUDINARY_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET

};
