export class ChangePasswordRequest {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(currentPassword?: string, newPassword?: string, confirmPassword?: string) {
    if (currentPassword) this.currentPassword = currentPassword;
    if (newPassword) this.newPassword = newPassword;
    if (confirmPassword) this.confirmPassword = confirmPassword;
  }
}
