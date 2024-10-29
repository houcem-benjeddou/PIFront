import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private baseUrl = environment.baseUrl + '/api';

  constructor(private http: HttpClient) { }

  handleChatBotRequest(msg: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post<string>(`${this.baseUrl}/chatbot`, `msg=${encodeURIComponent(msg)}`, { headers, responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }


  summarizeComplaint(question: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/livechat/${encodeURIComponent(question)}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
      return throwError(() => new Error('An error occurred on the client or network.'));
    } else {
      // The backend returned an unsuccessful response code.
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
      return throwError(() => new Error(error.error || 'Something bad happened; please try again later.'));
    }
  }

}
