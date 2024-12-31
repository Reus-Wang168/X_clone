 import User from "../models/user.model.js";
 import Notification from "../models/notification.model.js";
 import bcrypt from 'bcryptjs';
 import {v2 as cloudinary} from 'cloudinary';


export const getUserProfile = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username}).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile controller", error.message);
        res.status(500).json({ message: error.message });
        
    }
}


export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
      
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        if (id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot follow/unfollow yourself" });
        }
        if (!userToModify || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

         //取关
        if (isFollowing) {
            await User.findByIdAndUpdate(id, {
                $pull: { followers: req.user._id },
            });
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: id
            }});
            res.status(200).json({ message: "User unfollowed Successfully" });
        } else {
            
            await User.findByIdAndUpdate(id, {
                $push: { followers: req.user._id },
            });
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: id
            }});

            const newNotification = new Notification({
                
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
                
            })
            await newNotification.save();
                
            
            res.status(200).json({ message: "User followed Successfully" });
        }
       
        
        
    } catch (error) {
        console.log("Error in followUnfollowUser controller", error.message);
        res.status(500).json({ message: error.message });
    }
    

}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("following");

      // Aggregate pipeline should be an array
    const users = await User.aggregate([
        { $match: { _id: { $ne: userId } } },
        { $sample: { size: 10 } }
    ]);

        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id.toString()));
        const suggestedUsers = filteredUsers.slice (0, 4);
        
        suggestedUsers.forEach((user) => (user.password !=null));
            
    

        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.log("Error in getSuggestedUsers controller", error.message);
        res.status(500).json({ message: error.message });
    }

    
}

export const updateUserProfile = async (req, res) => {
     const {fullName, username,email, currentPassword, newPassword,bio,link} = req.body;

     let {profileImg, coverImg} = req.body;

     const userId = req.user._id;

     try{
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(!newPassword && currentPassword || (!currentPassword && newPassword)){
            return res.status(400).json({ error: "Please provide both current and new password" });
        }

        if (newPassword && currentPassword) {
            const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordMatched) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }
            if(newPassword.length < 6){
                return res.status(400).json({ error: "New password must be at least 6 characters long" });
            }

            if(newPassword === currentPassword){
                return res.status(400).json({ error: "New password cannot be the same as the current password" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
           

        }
        if (profileImg) {
            if(user.profileImg){
                //https://res.cloudinary.com/dyqj6jv2f/image/upload/v1688477393/avatars/6499b8e9c5f3a7f4a3e8a6d4.png
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await  cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url;


            
        }
        if (coverImg) {
            
            if(user.coverImg){
                //https://res.cloudinary.com/dyqj6jv2f/image/upload/v1688477393/avatars/6499b8e9c5f3a7f4a3e8a6d4.png
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await  cloudinary.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;



        res.status(200).json(user);
     } catch (error) {
        res.status(500).json({ error: error.message });
     }

    }
