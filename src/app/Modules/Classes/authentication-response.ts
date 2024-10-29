export class AuthenticationResponse {
  access_token: string;
  refresh_token: string;
  firstname?: string;
  lastname?: string;
  user: any;
  constructor(accessToken: string, refreshToken: string) {
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
  }
}
