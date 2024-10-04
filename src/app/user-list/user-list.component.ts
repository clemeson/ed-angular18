import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { CeilPipe } from './ceil.pipe';
import { Router } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
  // outros campos
}

interface UserResponse {
  data: User[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, CeilPipe],
})
export class UserListComponent implements OnInit {
  users: any[] = []; // Lista de usuários
  selectedUser: any = {}; // Usuário selecionado para edição ou atualização
  newUser: any = {}; // Novo usuário a ser criado
  isUpdateStatusModalOpen = false; // Controla a exibição do modal de status
  isUpdateRoleModalOpen = false; // Controla a exibição do modal de papel
  isCreateUserModalOpen = false; // Controla a exibição do modal de criação
  password: string = ''; // Campo para armazenar a senha do admin

  // Estado de Paginação
  isLoading: boolean = false;
  // users: User[] = [];
  totalPages: number = 0;
  totalUsers: number = 0;
  limit: number = 10;
  p: number = 1;

  currentUser: any = null; // Dados do usuário atual
  isSingleUserView: boolean = false;

  constructor(
    private userService: UserService,
    private _toastr: ToastrService,
    private router: Router, // Adicionado
    private authService: AuthService // Adicionado
  ) {}

  ngOnInit(): void {
    this.loadUsers(); // Carrega os usuários ao iniciar
  }

  // Método para carregar usuários
  loadUsers(): void {
    this.userService.getUsers(this.p, this.limit).subscribe(
      (response: UserResponse) => {
        this.users = response.data;
        this.totalUsers = response.meta.total;
        this.totalPages = response.meta.totalPages;
        this.p = response.meta.currentPage;
        this.isSingleUserView = false; // Exibimos a lista de usuários
        this._toastr.success('Usuários carregados com sucesso!', 'Sucesso');
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
        const errorMessage =
          error.error?.message || 'Erro ao carregar usuários.';
        if (error.status === 403 || 401) {
          // Se o erro for 403 (Forbidden), carregamos os dados do usuário atual
          this.loadCurrentUser();
        } else {
          this._toastr.error(errorMessage, 'Erro');
        }
      }
    );
  }

  loadCurrentUser(): void {
    const userId = this.authService.getCurrentUserId();
   
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (user: User) => {
          this.currentUser = user;
          this.isSingleUserView = true; // Exibir os dados do usuário atual
          console.log(this.currentUser)
          this._toastr.success(
            'Seus dados foram carregados com sucesso!',
            'Sucesso'
          );
        },
        (error) => {
          console.error('Erro ao carregar seus dados:', error);
          const errorMessage =
            error.error?.message || 'Erro ao carregar seus dados.';
          this._toastr.error(errorMessage, 'Erro');
        }
      );
    } else {
      this._toastr.error('Usuário não autenticado.', 'Erro');
      this.router.navigate(['/login']);
    }
  }
  get maxPages(): number {
    return Math.ceil(this.totalUsers / this.limit);
  }

  // Muda para a página anterior
  previousPage(): void {
    if (this.p > 1) {
      this.p--;
      this.loadUsers();
    }
  }

  // Muda para a próxima página
  nextPage(): void {
    const totalPages = Math.ceil(this.totalUsers / this.limit);
    if (this.p < totalPages) {
      this.p++;
      this.loadUsers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalUsers / this.limit)) {
      this.p = page;
      this.loadUsers();
    }
  }

  onPageChange(page: number): void {
    this.p = page;
    this.loadUsers();
  }

  // Abre o modal de Atualizar Status
  openUpdateStatusModal(user: any): void {
    this.selectedUser = { ...user };
    this.isUpdateStatusModalOpen = true;
  }

  // Abre o modal de Atualizar Papel
  openUpdateRoleModal(user: any): void {
    this.selectedUser = { ...user };
    this.isUpdateRoleModalOpen = true;
  }

  // Abre o modal de Criar Novo Usuário
  openCreateUserModal(): void {
    this.newUser = {}; // Reseta os dados do novo usuário
    this.isCreateUserModalOpen = true;
  }

  // Fecha todos os modais
  closeModal(): void {
    this.isUpdateStatusModalOpen = false;
    this.isUpdateRoleModalOpen = false;
    this.isCreateUserModalOpen = false;
    this.password = ''; // Reseta a senha do admin após fechar o modal
  }

  // Atualiza o status do usuário
  updateStatus(): void {
    this.userService
      .updateUserStatus(this.selectedUser.id, {
        status: this.selectedUser.status,
     
      })
      .subscribe(
        () => {
          this.loadUsers();
          this.closeModal();
          this.showSuccess(
            'Status do usuário atualizado com sucesso!',
            'Sucesso'
          );
        },
        (error) => {
          console.error('Erro ao atualizar status:', error);
          const errorMessage =
            error.error?.message || 'Erro ao atualizar status.';
          this.showError(errorMessage, 'Erro');
        }
      );
  }

  // Atualiza o papel do usuário
  updateRole(): void {
    this.userService
      .updateUserRole(this.selectedUser.id, this.password, { role: this.selectedUser.role })
      .subscribe(
        () => {
          this.loadUsers();
          this.closeModal();
          this.showSuccess('Papel do usuário atualizado com sucesso!', 'Sucesso');
        },
        (error) => {
          console.error('Erro ao atualizar papel:', error);
          const errorMessage = error.error?.message || 'Erro ao atualizar papel.';
          this.showError(errorMessage, 'Erro');
        }
      );
  }
  

  // Cria um novo usuário
  createUser(): void {
    this.userService.createUser(this.newUser).subscribe(
      () => {
        this.loadUsers();
        this.closeModal();
        this.showSuccess('Usuário criado com sucesso!', 'Sucesso');
      },
      (error) => {
        console.error('Erro ao criar usuário:', error);
        const errorMessage = error.error?.message || 'Erro ao criar usuário.';
        this.showError(errorMessage, 'Erro');
      }
    );
  }
  deleteUser(userId: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.loadUsers();
          this.showSuccess('Usuário excluído com sucesso!', 'Sucesso');
        },
        (error) => {
          console.error('Erro ao excluir usuário:', error);
          const errorMessage =
            error.error?.message ||
            error.statusText ||
            'Erro ao excluir usuário.';
          this.showError(errorMessage, 'Erro');
        }
      );
    }
  }

  logout(): void {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    // Opcional: Exibir uma mensagem de logout
    this.showSuccess('Você saiu da sua conta.', 'Logout');
    // Redirecionar para a página de login
    this.router.navigate(['/login']);
  }

  // Métodos para exibir toasts
  showSuccess(message: string, title?: string): void {
    this._toastr.success(message, title);
  }

  showError(message: string, title?: string): void {
    this._toastr.error(message, title);
  }

  showInfo(message: string, title?: string): void {
    this._toastr.info(message, title);
  }

  showWarning(message: string, title?: string): void {
    this._toastr.warning(message, title);
  }
}
