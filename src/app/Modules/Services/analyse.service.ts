import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AnalyseService {
  private baseUrl = environment.baseUrl + '/analyse';

  constructor(private http: HttpClient) {}

  getStockQuote(symbol: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/quote`, { params: { symbol } });
  }

  getRecommendationTrends(symbol: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/recommendation`, { params: { symbol } });
  }

  getHistoricalOptions(symbol: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/historical-options`, {
      params: { symbol },
    });
  }

  calculateRisk(symbol: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/risk`, {
      params: { symbol },
      responseType: 'text',
    });
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

  getSentimentAnalysis(symbol: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/sentiment`, {
      params: { symbol },
      responseType: 'text',
    });
  }

  performSentimentAnalysis(text: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/sentiment-custom`, text, { headers, responseType: 'text' });
  }
}
