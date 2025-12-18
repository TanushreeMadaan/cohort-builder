const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview"
});

/**
 * Build prompt for LLM
 */
function buildPrompt(userInput, columns) {
  return `
You are a medical data query parser.

Your task:
- Convert a natural language query into structured filters.
- Use ONLY the provided column names.
- NEVER invent column names.
- If a term is ambiguous, list it.
- If clarification is required, set clarification_needed = true.
- Return ONLY valid JSON. No markdown. No explanation.

Available columns:
${Object.keys(columns).join(", ")}

Column types:
${JSON.stringify(columns, null, 2)}

User query:
"${userInput}"

Return JSON in exactly this schema:
{
  "filters": {
    "<column_name>": {
      "operator": one of ["=", ">", "<", ">=", "<=", "contains", "in"],
      "value": string | number | boolean | array
    }
  },
  "ambiguities": string[],
  "assumptions": string[],
  "confidence": number between 0 and 1,
  "clarification_needed": boolean
}

Rules:
- If no filters apply, return empty filters.
- If user uses vague terms (example: "elderly"), explain ambiguity.
- If user references unavailable fields, add them to ambiguities.
`;
}

/**
 * Parse natural language query using LLM
 */
async function parseUserQuery(userInput, columns) {
    try {
      const prompt = buildPrompt(userInput, columns);
  
      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
  
      return parsed;
    } catch (error) {
      console.error("Gemini parsing failed:", error);
      throw new Error("Failed to parse query using Gemini");
    }
  }

module.exports = {
  parseUserQuery
};
