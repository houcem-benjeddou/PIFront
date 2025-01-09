import { Component } from '@angular/core';
import { PasswordResetService } from '../../../Services/password-reset.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  email: string = '';
  resetCodeSent: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private passwordResetService: PasswordResetService) {}

  sendResetCode() {
    if (!this.email) {
      this.errorMessage = 'Veuillez saisir une adresse e-mail valide.';
      return;
    }
    this.resetCodeSent = false;
    this.passwordResetService.sendResetCode(this.email).subscribe(
      response => {
        this.resetCodeSent = true;
        this.errorMessage = '';
        console.log('Le code de réinitialisation a été envoyé avec succès.');
      },
      error => {
        console.error('Erreur lors de l\'envoi du code de réinitialisation:', error);

        // Gestion des erreurs améliorée avec des messages différents
        if (error.status === 404) {
          this.errorMessage = 'Aucun compte trouvé avec cette adresse e-mail.';
        } else if (error.status === 500) {
          this.errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
        } else {
          this.errorMessage = 'Échec de l\'envoi du code. Veuillez réessayer.';
        }
        this.resetCodeSent = false;
      }
    );
  }
}
