import axios from "axios"
import { graph } from "../graph/graph"

export const agentController = async (req, res) => {
    try {
        const { prompt, conversationId } = req.body
        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
            conversationId,
            role: "user",
            content: prompt
        })

        const res = await graph.invoke({
            prompt,
            conversationId
        })

        const aiRes = res.aiResponse;

        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
            conversationId,
            role: "assistant",
            content: aiRes
        })
        return res.status(200).json({ aiRes })
    } catch (err) {
        return res.status(500).json({ message: "something went wrong", error: err.message })
    }
}