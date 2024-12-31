import express from 'express';
import {protectedRoute } from '../middleware/protectRoute.js';
import { getUserProfile, followUnfollowUser,getSuggestedUsers, updateUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile/:username',protectedRoute,getUserProfile);
router.get('/suggested',protectedRoute, getSuggestedUsers);

router.post('/follow/:id', protectedRoute,followUnfollowUser);

router.put('/update',protectedRoute, updateUserProfile);



export default router;