import { Order } from "./order.model";

export class Asset {
    id!: number;
    name!: string;
    price!: number;
    quantity!: number;
    type!: string;  // Could be stock, bond, etc.
    // Add any other asset-specific properties
    orders!: Order[];
  }
  