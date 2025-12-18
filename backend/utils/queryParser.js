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
You are a medical cohort query parser.

Your responsibilities:
- Convert natural language into structured filters ONLY when unambiguous
- Detect ambiguous terms and return clarification requests
- NEVER guess silently
- NEVER invent column names or values
- Use ONLY the provided schema

Available columns:
${Object.keys(columns).join(", ")}

Column metadata (type + example values):
${JSON.stringify(columns, null, 2)}

User query:
"${userInput}"

Return ONLY valid JSON in the following schema:
{
  "filters": {
    "<column_name>": {
      "operator": one of ["=", ">", "<", ">=", "<=", "contains", "in"],
      "value": string | number | boolean | array
    }
  },
  "clarification_requests": [
    {
      "term": string,
      "reason": string,
      "options": [
        {
          "label": string,
          "filter": {
            "<column_name>": {
              "operator": string,
              "value": any
            }
          }
        }
      ]
    }
  ],
  "assumptions": string[],
  "confidence": number,
  "clarification_needed": boolean
}

Rules:
- If a term is ambiguous, DO NOT include it in filters.
- Instead, add it ONLY to clarification_requests.
- If no ambiguity exists, clarification_requests must be empty
- If no filters apply, return empty filters
- If a user term exactly matches one of the example values (case-insensitive), DO NOT mark it ambiguous.
- Only ask clarification if multiple example values could match.
- Do not include markdown or explanations
- If ANY part of the query is ambiguous:
  - DO NOT apply a filter for it
  - Create a clarification_request
  - Do NOT silently ignore the term
  IMPORTANT:
If a term like "elderly", "available", "high", "low", "recent", or any vague concept
is present, you MUST return a clarification_request.
You MUST NOT ignore such terms.
`;
}

/**
 * Parse natural language query using Gemini
 */
async function parseUserQuery(userInput, columns) {
    try {
        const prompt = buildPrompt(userInput, columns);
        const result = await model.generateContent(prompt);

        const text = result.response.text();
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}");

        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error("Invalid JSON returned by Gemini");
        }

        return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    } catch (error) {
        console.error("Gemini parsing failed:", error);
        throw new Error("Failed to parse query using Gemini");
    }
}

module.exports = { parseUserQuery };
