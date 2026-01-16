
import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResponse, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        fat: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fiber: { type: Type.NUMBER },
        sugar: { type: Type.NUMBER },
      },
      required: ['calories', 'protein', 'fat', 'carbs']
    },
    humanSafety: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.STRING, description: 'safe, caution, or dangerous' },
        description: { type: Type.STRING },
        warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    animalSafety: {
      type: Type.OBJECT,
      properties: {
        dogs: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING },
            description: { type: Type.STRING },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        cats: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING },
            description: { type: Type.STRING },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    summary: { type: Type.STRING }
  },
  required: ['foodName', 'nutrition', 'humanSafety', 'animalSafety', 'summary']
};

export async function analyzeFood(
  input: string | { data: string, mimeType: string }, 
  language: Language = 'en'
): Promise<FoodAnalysisResponse> {
  const model = "gemini-3-flash-preview";
  
  const languageNames: Record<Language, string> = {
    en: 'English',
    zh: 'Chinese (Simplified)',
    ja: 'Japanese',
    ko: 'Korean',
    pt: 'Portuguese',
    es: 'Spanish'
  };

  const prompt = `Analyze this food item and provide ALL text responses in ${languageNames[language] || 'English'}. 
  Provide nutritional values (per 100g or typical serving size), 
  safety evaluation for humans (including allergens if obvious), 
  and safety evaluation for pets (dogs and cats). 
  Be specific about ingredients like xylitol, chocolate, onions, or grapes which are toxic to animals.`;

  const contents = typeof input === 'string' 
    ? { parts: [{ text: `Food to analyze: ${input}\n\n${prompt}` }] }
    : { parts: [{ inlineData: input }, { text: prompt }] };

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as FoodAnalysisResponse;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
}
