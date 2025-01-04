import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Portfolio } from '../models/portfolio.model';
import { Order } from '../models/order.model';


@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = 'http://localhost:8081/api/portfolios';

  constructor(private http: HttpClient) {}

 
  getPortfoliosByUser(userId: number): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.apiUrl}/user/${userId}`);
  }

  placeBuyOrder(assetName: string, quantity: number): Observable<any> {
    const payload = { assetName, quantity };
    return this.http.post(`${this.apiUrl}/buy`, payload);
  }

  transferFunds(userId: number, portfolioId: number, amount: number, direction: string): Observable<any> {
    const payload = { userId, portfolioId, amount, direction };
    return this.http.post(`${this.apiUrl}/transfer-funds`, payload);
  }


  createPortfolio(name: string, userId: number): Observable<any> {
    const payload = { name, userId }; // Include userId in the payload
    return this.http.post(`${this.apiUrl}/create-portfolio`, payload);
}
  
}
