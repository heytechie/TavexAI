import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import router from "./router.js";
import { chatAgent } from "../workers/chat.agent.js";
import { codingAgent } from "../workers/coding.agent.js";
import { imageGenAgent } from "../workers/imageGen.agent.js";
import { pdfGenAgent } from "../workers/pdfGen.agent.js";
import { pptAgent } from "../workers/ppt.agent.js";
import { searchAgent } from "../workers/search.agent.js";


const workflow = new StateGraph(agentState)

workflow.addNode("router", router)
workflow.addNode("chat", chatAgent)
workflow.addNode("coding", codingAgent)
workflow.addNode("imageGen", imageGenAgent)
workflow.addNode("pdfGen", pdfGenAgent)
workflow.addNode("ppt", pptAgent)
workflow.addNode("search", searchAgent)

workflow.addEdge("__start__", "router")
workflow.addConditionalEdges("router", (state) => {
    switch (state.agent) {
        case "chat":
            return "chat"
        case "coding":
            return "coding"
        case "imageGen":
            return "imageGen"
        case "pdfGen":
            return "pdfGen"
        case "ppt":
            return "ppt"
        case "search":
            return "search"
        default:
            return "chat"
    }
}, {
    chat: "chat",
    coding: "coding",
    imageGen: "imageGen",
    pdfGen: "pdfGen",
    ppt: "ppt",
    search: "search"
})

workflow.addEdge("chat", "__end__")
workflow.addEdge("coding", "__end__")
workflow.addEdge("imageGen", "__end__")
workflow.addEdge("pdfGen", "__end__")
workflow.addEdge("ppt", "__end__")
workflow.addEdge("search", "chat")


export const graph = workflow.compile()