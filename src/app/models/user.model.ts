import { Portfolio } from "./portfolio.model";

  export class User {
    id!: number;
    username!: string;
    password!: string;
    balance!: number;
    portfolios!: Portfolio[];  // Add this line to include portfolios
  }
  