import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService, PlaceOrderRequest } from 'src/app/services/order.service';
import { CommonModule } from '@angular/common';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { Portfolio } from 'src/app/models/portfolio.model';
import { Order } from 'src/app/models/order.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Asset } from 'src/app/models/asset.model';

@Component({
  selector: 'app-portfolios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css'],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolios: Portfolio[] = [];
  orders: Order[] = [];
  userId = 1; // Default user ID
  assetId = 0;
  newPortfolioName = '';
  creationMessage = '';
  currentOrders: { price: number; quantity: number; timestamp: string; type: string }[] = [];
  showOrdersModal = false;
  message: string = '';
  order: PlaceOrderRequest = {
    portfolioId: 0,
    assetName: '',
    price: 0,
    quantity: 0,
    type: 'BUY',
  };


  private subscription: Subscription = new Subscription(); // Manage subscriptions
  private intervalId: any; // For auto-refresh

  constructor(private portfolioService: PortfolioService, private orderService: OrderService) {}

  ngOnInit(): void {
    
    this.refreshPortfolios(); // Fetch portfolios immediately
    this.startAutoRefresh(); // Start auto-refresh every second
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh(); // Stop the auto-refresh interval
    this.subscription.unsubscribe(); // Clean up subscriptions
  }
 

  placeOrder(assetName: string, price: number, quantity: number, type: 'SELL' | 'BUY', portfolioId: number): void {
    if (!assetName || !price || !quantity || !type) {
      alert('Invalid order details. Please check the asset and portfolio information.');
      return;
    }
  
    const order: PlaceOrderRequest = {
      portfolioId: portfolioId, // A helper method to find the portfolio ID
      assetName: assetName,
      price: price,
      type: type,
      quantity: quantity,
    };
  
    this.orderService.placeOrder(order).subscribe(
      () => {
        alert('Order placed successfully!');
        this.refreshPortfolios();
      },
      (error) => {
        console.error('Error placing order:', error);
        alert('Failed to place order.');
      }
    );
  }
  
 
  
  // Fetch portfolios from the backend
  refreshPortfolios(): void {
    const portfolioSubscription = this.portfolioService.getPortfoliosByUser(this.userId).subscribe(
      (data) => {
        this.portfolios = data;
        this.orders = this.portfolios
          .flatMap((portfolio) => portfolio.assets)
          .flatMap((asset) => asset.orders);
      },
      (error) => {
        console.error('Error fetching portfolios:', error);
      }
    );

    this.subscription.add(portfolioSubscription); // Add subscription to manage it
  }

  // Start auto-refresh every second
  startAutoRefresh(): void {
    this.intervalId = setInterval(() => {
      this.refreshPortfolios(); // Refresh portfolio data every second
    }, 1000);
  }

  // Stop the auto-refresh interval
  stopAutoRefresh(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Stop the interval
    }
  }

  createPortfolio(): void {
    if (!this.newPortfolioName.trim()) {
      this.creationMessage = 'Portfolio name cannot be empty.';
      return;
    }

    this.portfolioService.createPortfolio(this.newPortfolioName, this.userId).subscribe(
      () => {
        this.creationMessage = 'Portfolio created successfully.';
        this.newPortfolioName = '';
        this.refreshPortfolios(); // Refresh portfolio list after creation
      },
      (error) => {
        console.error('Error creating portfolio:', error);
        this.creationMessage = error.error?.error || 'Failed to create portfolio.';
      }
    );
  }

  openOrdersModal(orders: { price: number; quantity: number; timestamp: string; type: string }[]): void {
    this.currentOrders = orders;
    this.showOrdersModal = true;
  }

  closeOrdersModal(): void {
    this.showOrdersModal = false;
    this.currentOrders = [];
  }
}
