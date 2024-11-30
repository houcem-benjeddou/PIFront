import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { RiskData } from "../Classes/models";

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
