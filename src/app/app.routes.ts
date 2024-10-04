import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from './auth.guard';
import { CallbackComponent } from './callback/callback.component';

export const routes: Routes = [
  { path: 'callback', component: CallbackComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] }, // Exemplo de rota protegida
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
