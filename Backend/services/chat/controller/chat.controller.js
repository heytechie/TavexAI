import Conversation from "../model/conversation.model.js";
import Message from "../model/message.model.js";



export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        console.log(userId);
        const conversation = await Conversation.create({
            userId: userId
        });
        return res.status(201).json({
            success: true,
            data: conversation
        })
    } catch (err) {
        console.log(err);
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        console.log(userId);
        const conversation = await Conversation.find({
            userId: userId
        }).sort({ updatedAt: -1 })
        return res.status(201).json({
            success: true,
            data: conversation
        })
    } catch (err) {
        console.log(err);
    }
}

export const updateConversation = async (req, res) => {
    const { conversationId, title } = req.body;
    try {
        const conversation = await Conversation.findByIdAndUpdate(
            conversationId,
            {
                title: title
            }
        )
        return res.status(200).json({
            success: true,
            data: conversation
        })
    } catch (error) {
        return res.status(500).json({
            message: `update conversation error ${error.message}`,
            success: false
        })
    }
}

export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content } = req.body;
        const message = await Message.create({
            conversationId,
            content,
            role
        })

        return res.status(201).json({
            success: true,
            data: message
        })
    } catch (err) {
        return res.status(500).json({
            message: `save msg error ${err.message}`,
            success: false
        })
    }
}

export const getAllMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        console.log(conversationId);
        const messages = await Message.find({
            conversationId: conversationId
        }).sort({ createdAt: 1 })
        return res.status(200).json({
            data: messages
        })
    } catch (error) {
        return res.status(500).json({
            message: `get all messages error ${error.message}`,
            success: false
        })
    }
}