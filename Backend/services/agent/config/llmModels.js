import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();


const groqModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
});

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
});

export const getModel = async (agent) => {
    switch (agent) {
        case "chat":
            return groqModel;
        case "search":
            return groqModel;
        case "coding":
            return geminiModel
        default:
            return groqModel;
    }
}