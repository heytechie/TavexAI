import axios from "axios"




export const getMessages = async (conversationId) => {
    try {
        const { data } = await axios.get(`${process.env.CHAT_SERVICE_URL}/get-messages/${conversationId}`)
        return data
    }
    catch (err) {
        console.log(err);
        return err
    }
}