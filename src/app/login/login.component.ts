import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms'; // Importando o FormsModule
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule], // Adicionando o FormsModule aos imports do componente
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private _toastr: ToastrService
  ) {}

  loginWithGitHub() {
    const clientId = 'Iv23lieyachjKxuXQWV2'; // Substitua pelo seu client ID do GitHub
    const redirectUri =
      'http://ed-teste-angular18.s3-website-us-east-1.amazonaws.com/callback'; // Certifique-se de que esta URL está registrada no GitHub

    // Monta a URL de autenticação do GitHub
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`;

    
    // Redireciona o usuário para a URL de autenticação do GitHub
    window.location.href = githubAuthUrl;
  }
  
 onSubmit() {
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      // Armazena o token no localStorage
      localStorage.setItem('token', response.access_token);
      // Redireciona para a página de usuários
      this.router.navigate(['/users']);
    },
    error: (err) => {
      // Verifica o status da resposta de erro
      if (err.status === 403) {
        this._toastr.error('Acesso negado. Verifique suas credenciais.', 'Erro 403: Forbidden');
      } else if (err.status === 400) {
        this._toastr.error('Requisição inválida. Verifique os dados enviados.', 'Erro 400: Bad Request');
      } else if (err.status === 401) {
        this._toastr.error('Não autorizado. Verifique seu login.', 'Erro 401: Unauthorized');
      } else {
        // Trata outros erros genéricos
        this._toastr.error('Ocorreu um erro inesperado.', 'Erro');
      }
    },
  });
}
}
