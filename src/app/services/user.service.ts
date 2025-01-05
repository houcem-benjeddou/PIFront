import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  getUserDetails(userId: number): Observable<{ username: string; balance: number }> {
    return this.http.get<{ username: string; balance: number }>(`${this.apiUrl}/${userId}`);
  }
}
