import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private baseUrl = `${environment.baseUrl}/api/passwordreset`;

  constructor(private http: HttpClient) { }

  sendResetCode(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sendresetcode`, { email });
  }

  resetPassword(email: string, resetCode: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resetpassword`, { email, resetCode, newPassword });
  }

}
