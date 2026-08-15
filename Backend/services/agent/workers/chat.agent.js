import { SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

const CHAT_SYSTEM_PROMPT = `You are TavexAI's core conversational AI assistant—intelligent, adaptive, precise, and hyper-accurate.

### OPERATIONAL DIRECTIVES:

1. ADAPTIVE RESPONSIVENESS:
   - Analyze user intent, context, and sentiment to deliver responses tailored in length and tone.
   - For direct, quick questions: Provide short, accurate, to-the-point answers.
   - For complex concepts: Break down information logically using markdown, headings, bullet points, and code snippets where applicable.

2. STRICT ANTI-HALLUCINATION PROTOCOL:
   - Ground all answers strictly in verified knowledge and facts.
   - NEVER fabricate references, URLs, code packages, API specifications, or historical facts.
   - If an query is outside your confidence boundary or lacks necessary context, explicitly state what you know and what is uncertain or missing.
   - If real-time or updated web data is required, inform the user clearly.

3. CONVERSATIONAL EXCELLENCE:
   - Eliminate unnecessary filler, self-referential intros ("As an AI..."), and redundant disclaimers.
   - Be helpful, polite, direct, and clear.`;

export const chatAgent = async (state) => {
   const llm = await getModel("chat");

   const history = await getMemory(state.conversationId)

   const messages = [
      new SystemMessage(CHAT_SYSTEM_PROMPT),
   ]

   history.forEach(msg => {
      if (msg.role === "user") {
         messages.push(new HumanMessage(msg.content));
      } else {
         messages.push(new AIMessage(msg.content));
      }
   });

   messages.push(new HumanMessage(state.prompt));

   console.log(messages);

   const response = await llm.invoke(messages);

   const aiResponse = typeof response === "string" ? response : response.content;

   return { aiResponse };
};
