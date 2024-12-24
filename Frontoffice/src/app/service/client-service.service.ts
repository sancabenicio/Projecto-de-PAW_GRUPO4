import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token'); 

    const headers = new HttpHeaders({
      'Authorization': token || '' 
    });

    return this.http.get<any>(`${this.apiUrl}/users/profile`, { headers });
  }

  editProfile(user: any): Observable<any> {
    const token = localStorage.getItem('token'); 

    const headers = new HttpHeaders({
      'Authorization': token || '' 
    });

    return this.http.put<any>(`${this.apiUrl}/users/edit-profile`, user, { headers });
  }

  getTickets(userId: any){
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': token || ''
    });

    return this.http.get<any>(`${this.apiUrl}/users/ticketsAPI/${userId}`, { headers }); 
  }

  editNameAndEmail(name: string, email: string): Observable<any> {
    const token = localStorage.getItem('token');
  
    const headers = new HttpHeaders({
      'Authorization': token || ''
    });
  
    const updatedUserData = {
      name: name,
      email: email
    };
  
    return this.http.put<any>(`${this.apiUrl}/users/edit-profile`, updatedUserData, { headers });
  }  

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('token');
  
    const headers = new HttpHeaders({
      'Authorization': token || ''
    });
  
    const passwordData = {
      currentPassword: currentPassword,
      newPassword: newPassword
    };
  
    return this.http.put<any>(`${this.apiUrl}/users/change-password`, passwordData, { headers });
  }

  deleteProfile(): Observable<any> {
    const token = localStorage.getItem('token'); // Obtém o token do localStorage

    const headers = new HttpHeaders({
      'Authorization': token || '' // Define um valor padrão vazio caso o token seja nulo
    });

    return this.http.delete<any>(`${this.apiUrl}/users/delete-profile`, { headers });
  }
}
