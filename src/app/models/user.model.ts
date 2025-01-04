export class Portfolio {
    id!: number;
    balance!: number;
    // Add any other properties related to Portfolio
  }
  
  export class User {
    id!: number;
    username!: string;
    password!: string;
    portfolios!: Portfolio[];  // Add this line to include portfolios
  }
  