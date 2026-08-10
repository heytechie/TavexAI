import express from 'express';
import { createConversation, getConversations, saveMessage, getAllMessages } from '../controller/chat.controller.js';

const router = express.Router();

router.post('/create-conversation', createConversation);
router.get('/create-conversation', createConversation);
router.get('/get-conversations', getConversations);
router.post('/save-message', saveMessage);
router.get('/get-messages/:conversationId', getAllMessages);


export default router