import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {AuthenticationService} from './authentication.service';
import {ChangePasswordRequest} from "../Classes/change-password-request";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.baseUrl}/user`;

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save`, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updateUser/${id}`, user);
  }
  /*changePassword(email: string, password: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` }); // Vous devez gérer l'authentification et stocker le token JWT localement
    const body = { email, password, newPassword };
    return this.http.patch<any>(`${this.baseUrl}/changepassword`, body, { headers });
  }*/
  changePassword(changePasswordRequest: ChangePasswordRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Now authService is correctly injected
    });
    return this.http.patch<any>(`${this.baseUrl}/changepassword`, changePasswordRequest, { headers });
  }


  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  // Méthode pour récupérer les utilisateurs avec pagination
  /*getAllUsersWithPagination(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.baseUrl}/all`, { params });
  }

  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }*/

  searchUsers(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search?keyword=${keyword}`);
  }

  /*getPaymentDelay(idUser: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/payment-delay/${idUser}`);
  }
  getUsersWithPaymentDelay(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users-with-delay`);
  }
  getTotalGains(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/totalGains`);
  }

  getAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admins`);
  }

  getTraders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/traders`);
  }


  confirmAccount(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ConfirmeCompte/${email}`, {});
  }


  getConnectedUser(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<User>(`${this.baseUrl}/session`, { headers });
  }

  verifyUser(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verifUser/${email}`);
  }*/

}
