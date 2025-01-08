import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarketData } from '../models/market-data';

@Injectable({
  providedIn: 'root',
})
export class MarketDataService {
  private apiUrl = 'http://localhost:8081/api/market'; // Your backend API URL

  constructor(private http: HttpClient) {}

  getHistoricalData(assetName: string, page: number = 0, size: number = 10): Observable<MarketData[]> {
    const url = `${this.apiUrl}/asset/${assetName}/history?page=${page}&size=${size}`;
    return this.http.get<MarketData[]>(url);
  }

  getCurrentMarketData(assetName: string): Observable<MarketData> {
    const url = `${this.apiUrl}/asset/${assetName}/current`;
    return this.http.get<MarketData>(url);
  }

  addAsset(assetName: string): Observable<any> {
    const url = `${this.apiUrl}/add-asset`;
    return this.http.post<any>(url, { assetName });
  }
  
  getAllAssets(): Observable<string[]> {
    const url = `${this.apiUrl}/all-assets`;
    return this.http.get<string[]>(url);
  }

  
  
}
