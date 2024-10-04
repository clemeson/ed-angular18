import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  createUser(user: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, user, { headers }); // Retorna um Observable
  }



  updateUserStatus(id: string, status: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/disable/${id}`, status, { headers }); // Retorna um Observable
  }


  updateUserRole(id: string, password: string, role: any): Observable<any> {
    const headers = this.getAuthHeaders();
    
    // Corpo da requisição contendo a senha do administrador e o novo papel
    const body = {
      userId: id, 
      password: password,
      ...role  // O role já deve ser um objeto no formato { role: 'ADMIN' }
    };
  
    return this.http.patch(`${this.apiUrl}/${id}/role`, body, { headers });
  }
  


  private apiUrl = 'http://ec2-52-90-9-193.compute-1.amazonaws.com/users'; // URL do backend NestJS

  constructor(private http: HttpClient) {}

  getUsers(p: number, limit: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const params = { page: p.toString(), limit: limit.toString() }; // Adicione os parâmetros de paginação
    return this.http.get(this.apiUrl, { headers, params }); // Passe os parâmetros na requisição GET
  }

  getUserById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  addUser(user: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, user, { headers });
  }

  deleteUser(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
