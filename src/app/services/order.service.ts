import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PlaceOrderRequest {
  portfolioId: number;
  assetName: string;
  price: number;
  quantity: number;
  type: 'BUY' | 'SELL';
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8081/api/orders'; // Backend API URL

  constructor(private http: HttpClient) {}

  placeOrder(order: PlaceOrderRequest): Observable<any> {
    const url = `${this.apiUrl}/place`;
    return this.http.post<any>(url, order);
  }
}
