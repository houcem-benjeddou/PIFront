import { Asset } from "./asset.model";
import { Order } from "./order.model";

export class Portfolio {
    id!: number;
    balance!: number;
    name!: string;      // The unique name of the portfolio
    userId!: number;  // Assuming a portfolio belongs to a user
    // Add any other portfolio-specific properties
    assets!: Asset[];
    orders!: Order[];
  }
  