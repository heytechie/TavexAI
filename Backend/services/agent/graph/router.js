import { getModel } from "../config/llmModels.js";

const router = async (state) => {
    const llm = await getModel("router");
    
    const prompt = `You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- image

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
real-time data,
news.

coding:
Writing code,
debugging,
programming concepts,
refactoring.

pdf:
Creating PDF files,
generating downloadable PDF documents.

ppt:
Creating PowerPoint presentations,
generating slide decks.

image:
Generating images,
creating visual assets,
art generation prompts.

User Request: "${state.prompt}"

Select the single best agent for this request. Return ONLY the exact agent name from the available agents list (chat, search, coding, pdf, ppt, image). Do not include any punctuation or extra text.`;

    const response = await llm.invoke(prompt);
    let selectedAgent = typeof response === "string" ? response.trim().toLowerCase() : response.content.trim().toLowerCase();

    // Map agent names to match graph node definitions
    if (selectedAgent.includes("pdf")) selectedAgent = "pdfGen";
    else if (selectedAgent.includes("image")) selectedAgent = "imageGen";
    else if (selectedAgent.includes("coding")) selectedAgent = "coding";
    else if (selectedAgent.includes("search")) selectedAgent = "search";
    else if (selectedAgent.includes("ppt")) selectedAgent = "ppt";
    else selectedAgent = "chat";

    return { agent: selectedAgent };
};

export default router;