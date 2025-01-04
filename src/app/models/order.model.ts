export class Order {
    id!: number;
    assetId!: number;
    portfolioId!: number;
    price!: number;
    timestamp!: string;
    quantity!: number;
    type!: string; // Buy or Sell
    // Add any other order-specific properties
  }
  