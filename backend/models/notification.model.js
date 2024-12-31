 import mongoose from "mongoose";

 const notificationSchema = mongoose.Schema({
       from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
       },
       to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
       },
       type: {
        type: String,
        enum: ['like', 'comment', 'follow'],
        required: true
       },
       read: {
        type: Boolean,
        default: false
       },
    //    post: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Post',
    //     required: true
    //    },
    //    createdAt: {
    //     type: Date,
    //     default: Date.now
    //    }
 }, { timestamps: true });

 export default mongoose.model('Notification', notificationSchema);