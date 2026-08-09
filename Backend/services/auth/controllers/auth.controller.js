import { getAuth } from 'firebase-admin/auth';
import { app } from "../config/firebase.js";
import User from '../models/user.model.js';

export const login = async (req, res) => {
    try {
        console.log("Auth service reached")
        const { token } = req.body;
        const decoded = getAuth(app);
        const userInfo = await decoded.verifyIdToken(token);
        let user = await User.findOne({
            firebaseUid: userInfo.uid
        })
        if (!user) {
            user = await User.create({
                firebaseUid: userInfo.uid,
                name: userInfo.displayName,
                email: userInfo.email,
                avatar: userInfo.picture
            })
        }

        const sessionId = crypto.randomUUID();

        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json(user)
    } catch (err) {
        console.log("Error on login", err)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}