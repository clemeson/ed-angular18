import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  private readonly apiUrl: string = environment.apiUrl;

  ngOnInit(): void {
    // Captura o código de autorização da URL
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (code) {
        // Envia o código para o backend para obter o token JWT

        this.http
          .post(`${this.apiUrl}/auth/github`, {
            code,
          })
          .subscribe(
            (response: any) => {
              // Salva o token JWT no localStorage
              localStorage.setItem('token', response.access_token);

              // Redireciona para a página de usuários ou dashboard
              this.router.navigate(['/users']);
            },
            (error) => {
              console.error('Erro ao autenticar com o GitHub:', error);
            }
          );
      }
    });
  }
}
