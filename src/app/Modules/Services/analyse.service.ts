import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { RiskData } from "../Classes/models";
export interface SentimentSentiment {
  ticker: string;
  relevance_score: string;
  positive_sentiment: number;
  negative_sentiment: number;
  neutral_sentiment: number;
  ticker_sentiment_score?: string;
  ticker_sentiment_label?: string;
}

export interface Topic {
  topic: string;
  relevance_score: string;
}

export interface NewsSentiment {
  feed: Array<{
    title: string;
    url: string;
    time_published: string;
    authors: string[];
    summary: string;
    banner_image: string;
    source: string;
    category_within_source: string;
    topics: Topic[];
    overall_sentiment_score: string;
    overall_sentiment_label: string;
    ticker_sentiment: SentimentSentiment[];
  }>;
}
@Injectable({
  providedIn: 'root',
})
export class AnalyseService {
  private baseUrl = `${environment.baseUrl}/analyse`;

  constructor(private http: HttpClient) {}

  getStockQuote(symbol: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/quote`, { params: { symbol } });
  }

  getRecommendationTrends(symbol: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/recommendation`, { params: { symbol } });
  }

  getHistoricalOptions(symbol: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/historical-options`, {
      params: { symbol }
    }).pipe(
      catchError(error => {
        console.error('Error fetching historical options', error);
        return throwError(() => new Error('Failed to fetch historical options'));
      })
    );
  }

  calculateRisk(symbol: string): Observable<RiskData> {
    return this.http.get<RiskData>(`${this.baseUrl}/risk`, { params: { symbol } });
  }

  getBasicFinancials(symbol: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/basic-financials`, { params: { symbol } });
  }

  getFullSentimentAnalysis(symbol: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/sentiment-full`, {
      params: { symbol },
      responseType: 'text',
    });
  }

  getSentimentAnalysis(symbol: string): Observable<NewsSentiment> {
    return this.http.get(`${this.baseUrl}/sentiment`, {
      params: { symbol },
      responseType: 'text', // Recevoir la réponse en tant que texte
    }).pipe(
      map(response => JSON.parse(response)) // Parser le JSON
    );
  }

  performSentimentAnalysis(text: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/sentiment-custom`, text, { headers, responseType: 'text' });
  }
}
