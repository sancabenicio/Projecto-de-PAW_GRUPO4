import { Component, OnInit } from '@angular/core';
import { ClientServiceService } from '../../service/client-service.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';
import { Ticket } from '../../model/ticket.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: any;
  tickets: Ticket[] = [];
  newPassword: string = '';
  currentPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  errorMessageP: string = '';
  successMessageP: string = '';
  confirmDelete: boolean = false;

  constructor(private clientService: ClientServiceService,
                private authenticationService: AuthenticationService, 
               private router: Router) {}

  ngOnInit() {
    this.clientService.getProfile().subscribe(
      (response) => {
        this.user = response;
        console.log(this.user);
    
        // Fetch tickets only after user profile is obtained
        this.clientService.getTickets(this.user._id).subscribe(
          (data: any) => {
            this.tickets = data.tickets;
            console.log(this.tickets);
          },
          (error: any) => {
            console.log('Error retrieving user tickets:', error);
          }
        );
      },
      (error) => {
        console.log('Error obtaining user profile:', error);
      }
    );    
  }

  editProfile(name: string, email: string): void {
    this.clientService.editNameAndEmail(name, email).subscribe(
      (response) => {
        this.user.name = response.name;
        this.user.email = response.email;
        this.successMessage = 'Perfil editado com sucesso!';
      },
      (error) => {
        this.errorMessage = 'Erro ao editar perfil: ' + error;
      }
    );
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessageP = 'As senhas não correspondem';
      return;
    }
  
    this.clientService.changePassword(this.currentPassword, this.newPassword).subscribe(
      () => {
        const successMessage = 'Senha alterada com sucesso!';
        this.successMessageP = successMessage;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.errorMessageP = ''; // Limpa a mensagem de erro caso tenha sido definida anteriormente
      },
      (error) => {
        if (error.error && error.error.message) {
          this.errorMessageP = 'Erro ao alterar a senha!\nVerifique a senha atual se está correta. ' + error.error.message;
        } else {
          this.errorMessageP = 'Erro ao alterar a senha!\nVerifique a senha atual se está correta.';
        }
        this.successMessageP = ''; // Limpa a mensagem de sucesso caso tenha sido definida anteriormente
      }
    );
  }
  

  deleteProfile(): void {
    if (!this.confirmDelete) {
      this.errorMessage = 'Por favor, confirme a exclusão do perfil.';
      return;
    }
    this.clientService.deleteProfile().subscribe(
      () => {
        // Limpar informações do usuário após a exclusão
        this.user = null;
        // Redirecionar para uma página ou exibir uma mensagem informando que o perfil foi excluído
        this.router.navigate(['/pagina']);
      },
      (error) => {
        this.errorMessage = 'Erro ao excluir perfil: ' + error;
      }
    );
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/homepage']);
  }
}
