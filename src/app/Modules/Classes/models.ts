export interface RecommendationTrend {
  dates: string[];
  values: number[];
}

export interface HistoricalOption {
  date: string;
  value: number;
}

export interface RiskData {
  symbol: string;
  date: string;
  value: number;
}

export interface SentimentAnalysisData {
  sentimentScores: number[];
}
interface ParsedData {
  expiration: string;
  last: number;
}
