import jwt from "jsonwebtoken";

import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
	if (!ENV_VARS.JWT_SECRET) {
	  throw new Error("JWT_SECRET is not defined in the environment variables");
	}
  
	const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });
  
	res.cookie("jwt", token, {
	  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
	  httpOnly: true, // prevent XSS attacks
	  sameSite: "strict", // prevent CSRF attacks
	  secure: ENV_VARS.NODE_ENV !== "development", // in production, cookies are secure
	});
  };
  ;
