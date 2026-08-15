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