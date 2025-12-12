import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DorkCategory, DorkCategoryResult, SearchPlatform } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      categoryName: { type: Type.STRING },
      dorks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING, description: "The actual search query string" },
            description: { type: Type.STRING, description: "What this query aims to find" },
            category: { type: Type.STRING },
            intent: { 
              type: Type.STRING, 
              enum: ["Offensive", "Defensive", "Hybrid"],
              description: "Whether the dork is for offensive recon, defensive monitoring, or both."
            }
          },
          required: ["query", "description", "category", "intent"]
        }
      }
    },
    required: ["categoryName", "dorks"]
  }
};

const cleanJsonOutput = (text: string): string => {
  // Remove markdown code blocks if present
  let clean = text.replace(/```json\s*/g, "").replace(/```\s*$/g, "");
  // Remove any text before the first [ and after the last ]
  const firstBracket = clean.indexOf('[');
  const lastBracket = clean.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1) {
    clean = clean.substring(firstBracket, lastBracket + 1);
  }
  return clean;
};

export const generateDorks = async (target: string, categories: DorkCategory[], platform: SearchPlatform, smartSearch: boolean = false): Promise<DorkCategoryResult[]> => {
  const modelId = "gemini-2.5-flash";
  
  const categoryListString = categories.join(", ");

  let platformInstruction = "";
  
  switch(platform) {
    case SearchPlatform.GOOGLE:
      platformInstruction = "Use Google Search Operators: site:, filetype:, inurl:, intitle:, intext:, -exclude. Nest logic with OR/AND.";
      break;
    case SearchPlatform.BING:
      platformInstruction = "Use Bing Search Operators: site:, filetype:, ip:, instreamset:, hasfeed:. Note: Bing supports 'ip:' operator which Google does not.";
      break;
    case SearchPlatform.SHODAN:
      platformInstruction = "Use SHODAN Filters: org:, ssl:, port:, product:, http.title:, hostname:, os:, net:. DO NOT use Google operators like 'site:' or 'inurl:'. Example: 'org:\"Target\" port:443'.";
      break;
    case SearchPlatform.GITHUB:
      platformInstruction = "Use GITHUB Search Syntax: org:, user:, repo:, language:, path:, filename:, extension:. DO NOT use 'site:github.com'. Use the native GitHub search fields. Example: 'org:Target filename:.env'.";
      break;
    case SearchPlatform.CENSYS:
      platformInstruction = "Use CENSYS Search Language: services.port:, services.http.response.headers.server:, location.country_code:. Example: 'services.tls.certificates.leaf_data.names: example.com'.";
      break;
    case SearchPlatform.DUCKDUCKGO:
      platformInstruction = "Use DuckDuckGo Operators: similar to Google but optimize for privacy-focused indexing. site:, filetype:.";
      break;
    default:
       platformInstruction = "Use Google Search Operators.";
  }

  const prompt = `
    ROLE: You are "OmniScout 360", an elite offensive security engineer and OSINT specialist.
    INTELLIGENCE SOURCE (PLATFORM): "${platform}"
    
    ${smartSearch ? 
    `MODE: NATURAL LANGUAGE PROCESSING (SMART SEARCH / NLP)
     USER REQUEST: "${target}"
     INSTRUCTION: The user has provided a natural language description (e.g., "find open cameras", "leaked passwords for tesla", "confidential pdfs"). 
     1. Analyze the user's intent from the request.
     2. TRANSLATE this intent into precise, high-impact search queries (dorks) specifically for **${platform}**.
     3. Automatically categorize the results based on what the query aims to find (e.g., if finding cameras, use 'IoT & Devices' category).
     4. Generate 20+ variations.` 
    : 
    `MODE: TARGET SCANNING
     TARGET: "${target}"
     SCOPE (SELECTED MODULES): ${categoryListString}
     INSTRUCTION: Generate specific dorks for this target domain/keyword based strictly on the selected categories.`}
    
    OBJECTIVE: Generate ELITE, HIGH-IMPACT, and COMPLEX Search Queries to uncover hidden attack surfaces, leaked data, and vulnerabilities on **${platform}**.

    ### CRITICAL INSTRUCTIONS:
    1. **PLATFORM SPECIFIC SYNTAX**: 
       - ${platformInstruction}
       - **DO NOT** use syntax from other platforms. If the platform is SHODAN, do NOT generate a Google Dork.
    
    2. **QUANTITY**: 
       - ${smartSearch ? "Generate 15-20 highly relevant queries based on the intent." : "Generate a total of 30+ unique queries across the selected categories."}
       
    3. **COMPLEXITY**:
       - Avoid basic queries. Use advanced filtering specific to the platform.
       - If Shodan: look for specific vulnerabilities (CVEs), obsolete headers, or exposed databases.
       - If GitHub: look for leaked secrets, specific config files, and internal code.
       
    4. **INTENT CLASSIFICATION**:
       - **Offensive**: Looking for exploit points, Admin panels, Vulnerable versions.
       - **Defensive**: Looking for employee emails, accidental cloud bucket leaks, exposed docs.

    ### REQUIRED OUTPUT FORMAT:
    Return ONLY a raw JSON array. Do not include markdown formatting like \`\`\`json.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    if (response.text) {
      const cleanJson = cleanJsonOutput(response.text);
      const data = JSON.parse(cleanJson) as DorkCategoryResult[];
      return data;
    }
    throw new Error("No response text generated from AI model.");
  } catch (error) {
    console.error("Gemini Dork Generation Error:", error);
    throw new Error("Failed to generate intelligence. The AI model encountered an error parsing the complex dork structure. Please try again with fewer categories or a different target.");
  }
};