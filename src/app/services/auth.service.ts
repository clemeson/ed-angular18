import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment.prod';

interface LoginResponse {
  access_token: string;
  // Add other properties if necessary
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string = environment.apiUrl;
  private currentUserId: number | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response: LoginResponse) => {
          const token = response.access_token;

          // Store the token
          localStorage.setItem('token', token);

          // Decode the token to extract user ID
          const decodedToken: any = jwtDecode(token);
          this.currentUserId = decodedToken.id; // Adjust property name based on your token's payload
        })
      );
  }

  getCurrentUserId(): number | null {
    if (this.currentUserId !== null) {
      return this.currentUserId;
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.currentUserId = decodedToken.id; // Adjust property name
      return this.currentUserId;
    }

    return null;
  }
}
