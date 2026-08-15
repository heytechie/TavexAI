import redis from '../../../shared/redis/redis'
import { getMessages } from '../utils/get-messages';

export const getMemory = async (conversationId) => {
    const key = `messages-${conversationId}`

    const cached = await redis.get(key)

    if (cached) {
        return JSON.parse(cached);
    }

    const messages = await getMessages(conversationId);

    if (messages.length > 0) {
        await redis.set(key, JSON.stringify(messages), 'EX', 60 * 60 * 24);
    } else {
        await redis.del(key)
    }

    return messages
}


export const addMessage = async (conversationId, role, content) => {
    const key = `messages-${conversationId}`

    const raw = await getMemory(conversationId);
    const messages = raw ? JSON.parse(raw) : [];

    messages.push({
        role,
        content
    });

    if (messages.length > 20) {
        messages.shift();
    }

    await redis.set(key, JSON.stringify(messages), 'EX', 60 * 60 * 24);
}