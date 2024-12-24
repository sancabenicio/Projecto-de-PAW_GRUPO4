import { Component } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  email: string = '';
  mensagem: string = '';
  emailEnviado: boolean = false;
  mostrarFormulario: boolean = true;

  constructor(private authService: AuthenticationService, private router: Router) {}

  emailNotFoundErrorMessage: string = '';

recuperarSenha() {
  if (!this.email) {
    return;
  }

  this.emailNotFoundErrorMessage = ''; // Limpa a mensagem de erro

  this.authService.recuperarSenha(this.email).subscribe(
    response => {
      this.mensagem = response.message;
      this.email = '';
      this.emailEnviado = true;
      this.mostrarFormulario = false; // Oculta o formulário após o envio do email
    },
    error => {
      console.log('Erro na solicitação de recuperação de senha:', error);
      if (error.status === 404) {
        this.emailNotFoundErrorMessage = 'Email não encontrado. Verifique o email digitado.';
      } else {
        this.mensagem = 'Erro ao solicitar recuperação de senha. Por favor, tente novamente mais tarde.';
      }
    }
  );
}

  redirecionarParaLogin() {
    this.router.navigate(['/login']);
  }
}
