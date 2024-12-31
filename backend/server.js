import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/authRoutes.js";
import { ENV_VARS} from "./config/envVars.js";
import userRoutes from "./routes/user.route.js";

import { connectDB } from "./config/db.js";
import {v2 as cloudinary} from "cloudinary";


cloudinary. config({
    cloud_name: ENV_VARS.CLOUDINARY_NAME,
    api_key: ENV_VARS.CLOUDINARY_API_KEY,
    api_secret: ENV_VARS.CLOUDINARY_API_SECRET
})
const app = express();
const PORT = ENV_VARS.PORT;

const __dirname = path.resolve();

app.use(express.json()); // will allow us to parse req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);




app.listen(PORT, () => {
	console.log("Server started at http://localhost:" + PORT);
	connectDB();
});


