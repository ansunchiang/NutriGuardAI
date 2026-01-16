
export type Language = 'en' | 'zh' | 'ja' | 'ko' | 'pt' | 'es';

export interface NutritionData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sugar: number;
}

export interface SafetyAssessment {
  level: 'safe' | 'caution' | 'dangerous' | 'unknown';
  description: string;
  warnings: string[];
}

export interface FoodAnalysisResponse {
  foodName: string;
  nutrition: NutritionData;
  humanSafety: SafetyAssessment;
  animalSafety: {
    dogs: SafetyAssessment;
    cats: SafetyAssessment;
  };
  ingredients: string[];
  summary: string;
}

export interface HistoryItem extends FoodAnalysisResponse {
  id: string;
  timestamp: number;
  imageUrl?: string;
}
