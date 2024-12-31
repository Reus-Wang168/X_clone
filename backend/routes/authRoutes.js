import express from 'express';
import {signup, login,logout, getMe} from '../controllers/authController.js';
import {protectedRoute} from '../middleware/protectRoute.js';

// 创建路由实例
const router = express.Router();


// 注册路由
console.log("GET /me route accessed");

router.get('/me',protectedRoute, getMe);

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

export default router;