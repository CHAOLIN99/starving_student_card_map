// server/routes/chat.js

const express = require("express");
const { OpenAI } = require("openai");
const { dealDB } = require("../database/deal");

const chatRouter = express.Router();

const openaiClient = new OpenAI({
  apiKey: require("../config").openaiKey,
});


const DEAL_SCHEMA = `
  The database contains an array of 'deal' objects. Each object has this structure:
  {
    id: 'string',
    type: 'string', // e.g., "Free Stuff", "Discount"
    numUses: 'number' | 'null', 
    description: 'string', // e.g., "One FREE! Admission!", "BOGO shake", "10% off purchase"
    store: {
      name: 'string', // e.g., "Taste117", "ComedyBox Utah", "J-Dawgs"
    }
  }

  IMPORTANT SEARCH INSTRUCTIONS:
  1. The database does NOT have a 'category' or 'cuisine' field.
  2. To find specific items (like "Korean", "Mexican", "Sweet", "Dessert"), you MUST search for those keywords within **deal.store.name** OR **deal.description**.
  3. ALWAYS use case-insensitive checks (e.g., .toLowerCase().includes(...)).
`;


async function getChatGptResponse(content, temperature = 0.3) {
  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o", 
      messages: [{ role: "user", content: content }],
      temperature: temperature,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}


function cleanCodeResponse(response) {
  let clean = response.replace(/```javascript/g, "").replace(/```/g, "");
  return clean.trim();
}

chatRouter.post("/", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).send({ message: "No question provided." });
  }

  try {
    const allDeals = await dealDB.getAllDeals();
    const filterPrompt = `
      ${DEAL_SCHEMA}
      User question: "${question}".

      Your task is to generate ONLY a concise, valid JavaScript arrow function for array filtering. 
      The function takes a single 'deal' object as an argument and returns 'true' if the deal matches the user's request, and 'false' otherwise.

      RULES:
      1. Respond ONLY with the code. No markdown, no explanations.
      2. Use case-insensitive matching (.toLowerCase().includes()).
      3. If the user asks for a category (e.g. "Korean"), look for that keyword in BOTH 'deal.store.name' AND 'deal.description'.
      4. If the user asks for "sweet" or "dessert", look for keywords like "chocolate", "cookie", "cake", "shake", "dessert", "ice cream" in the description.

      Examples:
      - Question: "Any korean food?"
        Response: (deal) => deal.store.name.toLowerCase().includes("korean") || deal.description.toLowerCase().includes("korean") || deal.description.toLowerCase().includes("bibimbap")

      - Question: "I want something sweet"
        Response: (deal) => deal.description.toLowerCase().includes("chocolate") || deal.description.toLowerCase().includes("dessert") || deal.description.toLowerCase().includes("cookie") || deal.store.name.toLowerCase().includes("bakery")

      - Question: "Deals with unlimited uses?"
        Response: (deal) => deal.numUses === null

      Generate the arrow function for the user's question now:
    `.trim();

    const rawFilterResponse = await getChatGptResponse(filterPrompt, 0.1);
    const jsFilterFunctionString = cleanCodeResponse(rawFilterResponse);
    
    console.log(`Question: "${question}"`);
    console.log(`Generated Filter: ${jsFilterFunctionString}`);

    let filteredDeals = [];
    
    try {
        const filterFn = new Function('deal', `return ${jsFilterFunctionString}(deal);`);
        filteredDeals = allDeals.filter(filterFn);
    } catch (e) {
        console.error("Error executing filter function:", e);
        filteredDeals = []; 
    }

    console.log(`Found ${filteredDeals.length} matches.`);

    const conciseFilteredData = filteredDeals.map(d => ({
        store: d.store.name, 
        offer: d.description, 
        uses: d.numUses === null ? "Unlimited" : d.numUses
    }));

    const answerPrompt = `
      The user asked: "${question}".
      
      I queried the database and found these ${conciseFilteredData.length} matches:
      ${JSON.stringify(conciseFilteredData)}

      Please answer the user's question in a friendly, helpful tone. 
      - If deals were found, list 2-3 of the best ones specifically.
      - If NO deals were found, say "I couldn't find any deals matching that description right now." and suggest they try a different search (like "Free Stuff" or "Provo").
      - Keep it concise (under 3 sentences).
    `.trim();
    
    const friendlyResponse = await getChatGptResponse(answerPrompt, 0.7);

    res.send({ answer: friendlyResponse, deals: filteredDeals });

  } catch (error) {
    console.error("Chatbot processing error:", error.message);
    res.status(500).send({ message: "An internal server error occurred while processing your request." });
  }
});

module.exports = chatRouter;