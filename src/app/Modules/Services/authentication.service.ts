import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { Role, User } from "../Classes/user";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthenticationResponse } from "../Classes/authentication-response";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private baseUrl = `${environment.baseUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  UserService: any;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
  register(request: any): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/register`, request).pipe(
      tap(response => this.storeTokens(response)),
      catchError(error => {
        console.error('Registration Error:', error);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }
  authenticate(request: { email: string, password: string }): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error during authentication:', error.message);
        return throwError(() => new Error(`Authentication failed. Please check your credentials and try again. Error: ${error.message}`));
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        if (res.user) { // Assuming user details are included in the login response under 'user'
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
          this.handleAuthenticationSuccess(res);

        }
      }),
      catchError(error => {
        console.error('Login Error:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }


  private handleAuthenticationSuccess(response: any): void {
    localStorage.setItem('accessToken', response.access_token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
    this.redirectUserBasedOnRole(response.user.role);
  }
  private redirectUserBasedOnRole(role: Role): void {
    switch (role) {
      case Role.ADMIN:
      case Role.TRADER:
        this.router.navigate(['/admin']);
        break;

      default:
        this.router.navigate(['/login']);
        break;
    }
  }

  logout(): Observable<any> {
    this.clearSession();
    return this.http.post<any>(`${this.baseUrl}/logout`, {}).pipe(
      catchError(error => {
        console.error('Logout Error:', error);
        return throwError(() => new Error('Logout failed'));
      })
    );
  }
  private storeTokens(response: AuthenticationResponse): void {
    if (response.access_token) {
      localStorage.setItem('accessToken', response.access_token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refreshToken', response.refresh_token);
    }
  }


  private clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  async roleMatch(allowedRoles: Role[]): Promise<boolean> {
    let isMatch = false;
    const userRoles = await this.UserService.getRoles();
    if (userRoles != null && userRoles) {
      if (userRoles === allowedRoles[0]) {
        isMatch = true;
      }
    }
    return isMatch;
  }
}
