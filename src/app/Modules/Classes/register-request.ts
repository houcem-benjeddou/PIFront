import { Role } from './user';
import { Gender } from './user';

export class RegisterRequest {
  email!: string;
  password!: string;
  role!: Role;
  firstname!: string;
  lastname!: string;
  dateOfBirth!: Date;
  gender!: Gender;
  region!: string;
  phoneNumber!: string;
  job!: string;
}
