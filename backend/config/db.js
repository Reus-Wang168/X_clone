
import mongoose from 'mongoose';
import { ENV_VARS } from './envVars.js';

// 获取 MongoDB 连接 URI，可以从环境变量中读取

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
		console.log("MongoDB connected: " + conn.connection.host);
	} catch (error) {
		console.error(error);
		process.exit(1);

	}
}
