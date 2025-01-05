import { Asset } from "./asset.model";
import { Order } from "./order.model";

export class Portfolio {
  id!: number;
  balance!: number;
  name!: string; // Portfolio name
  userId!: number; // User ID
  assets!: Asset[]; // List of assets
  orders!: Order[]; // List of orders
   // Default to an empty string
}
