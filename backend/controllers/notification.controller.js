import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {

    try {
        const userId = req.user._id;
        const notifications = await Notification.find({
             user: userId }).populate({
                 path: 'from',
                 select: 'username profileImg'
             });
        await Notification.updateMany({ to: userId }, { read: true });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}

export const deleteNotifications = async (req, res) => {

    try {
        const userId = req.user._id;

        const notificationId = req.params.id;

        const notification = await Notification.findById(notificationId);

        if(!notificationId) {
            return res.status(400).json({ message: 'Notification id is required' });
        }
        
        if(notification.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this notification' });
        }

        res.status(200).json({ message: 'Notifications deleted successfully' });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
    
}

