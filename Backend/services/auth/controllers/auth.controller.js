import { getAuth } from 'firebase-admin/auth';
import { app } from "../config/firebase.js";
import User from '../models/user.model.js';
import redis from '../../../shared/redis/redis.js';

export const login = async (req, res) => {
    try {
        // console.log("Auth service reached")
        const { token } = req.body;
        const decoded = getAuth(app);
        const userInfo = await decoded.verifyIdToken(token);
        const name = userInfo.name || userInfo.displayName;
        const avatar = userInfo.picture || userInfo.avatar || '';

        let user = await User.findOne({
            firebaseUid: userInfo.uid
        });

        if (!user) {
            user = await User.create({
                firebaseUid: userInfo.uid,
                name,
                email: userInfo.email,
                avatar
            });
        } else if (!user.name || !user.avatar) {
            user.name = user.name || name;
            user.avatar = user.avatar || avatar;
            await user.save();
        }

        const sessionId = crypto.randomUUID();
        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }), "EX", 7 * 24 * 60 * 60);

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


export const logout = async (req, res) => {
    try {
        console.log("logout reached")
        const sessionId = req.cookies?.sessionId;
        console.log("sessionId:", sessionId)
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "You are not logged in"
            })
        }

        await redis.del(`session-${sessionId}`);

        res.clearCookie("sessionId")
        return res.json({
            success: true,
            message: "Logout successfully"
        })
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}