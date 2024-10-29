export enum Gender{
MALE, FEMALE
}

export enum Role{
ADMIN,TRADER
}

export class User {
  idUser!: number;
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
  createdDate!: Date;


}
