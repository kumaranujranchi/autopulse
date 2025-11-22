import { GoogleGenAI, Type } from "@google/genai";
import { Article, NewsCategory } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a list of realistic structured news articles based on a category.
 * Uses JSON schema enforcement for UI consistency.
 */
export const fetchNewsFeed = async (category: NewsCategory): Promise<Article[]> => {
  const prompt = `Generate 9 distinct, realistic, and engaging news headlines and summaries related to "${category}" in the automotive world (India and Global). 
  Include a mix of new launches, reviews, and industry updates. 
  Make the tone professional and journalistic, similar to a top-tier news website.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { type: Type.STRING },
              author: { type: Type.STRING },
              publishedTime: { type: Type.STRING, description: "e.g. '2 hours ago', 'Just now'" },
            },
            required: ["headline", "summary", "category", "author", "publishedTime"]
          }
        }
      }
    });

    const rawData = response.text;
    if (!rawData) return [];

    const parsedData = JSON.parse(rawData);
    
    // Hydrate with client-side IDs and visual seeds
    return parsedData.map((item: any, index: number) => ({
      ...item,
      id: `article-${Date.now()}-${index}`,
      imageSeed: Math.floor(Math.random() * 1000) + index
    }));

  } catch (error) {
    console.error("Gemini API Error (Feed):", error);
    return [];
  }
};

/**
 * Generates the full body of an article when a user clicks 'Read More'.
 */
export const generateFullArticle = async (headline: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a full, detailed 400-word journalistic news article for the headline: "${headline}". 
      Use HTML formatting (<h3> for subheads, <p> for paragraphs). 
      Do not include the title in the body.`,
    });
    return response.text || "<p>Content unavailable.</p>";
  } catch (error) {
    console.error("Gemini API Error (Article):", error);
    return "<p>Failed to load article content.</p>";
  }
};

/**
 * Performs a live grounded search for specific queries using the Search Tool.
 * Note: Schema is disabled when using tools.
 */
export const searchLiveNews = async (query: string): Promise<{ text: string, sources: {title: string, uri: string}[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the latest automotive news about: ${query}. Summarize the key findings in 3 paragraphs.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No results found.";
    
    // Extract grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((c: any) => c.web?.uri && c.web?.title)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri
      }));

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error (Search):", error);
    return { text: "Search unavailable at the moment.", sources: [] };
  }
};
