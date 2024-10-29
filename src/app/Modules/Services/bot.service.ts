import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  private baseUrl = environment.baseUrl + '/api/bot/chat';

  constructor(private http: HttpClient) {}

  chatWithBot(prompt: string): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}?prompt=${encodeURIComponent(prompt)}`, { responseType: 'text' as 'json' });
  }
}
