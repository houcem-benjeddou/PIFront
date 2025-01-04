import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { Portfolio } from 'src/app/models/portfolio.model';
import { Order } from 'src/app/models/order.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-portfolios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css'],
})
export class PortfolioComponent implements OnInit {
  portfolios: Portfolio[] = [];
  orders: Order[] = []; // To store all orders
  userId = 1; // Default user ID (can be dynamically set if needed)
  newPortfolioName = ''; // For storing the new portfolio name
  creationMessage = ''; // For success/error messages
  showOrdersModal = false; // To control the visibility of the modal

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.getPortfolios();
  }

  getPortfolios(): void {
    this.portfolioService.getPortfoliosByUser(this.userId).subscribe(
      (data) => {
        this.portfolios = data;

        // Gather all orders from all assets
        this.orders = this.portfolios
          .flatMap((portfolio) => portfolio.assets)
          .flatMap((asset) => asset.orders);
      },
      (error) => {
        console.error('Error fetching portfolios:', error);
      }
    );
  }

  createPortfolio(): void {
    if (!this.newPortfolioName.trim()) {
      this.creationMessage = 'Portfolio name cannot be empty.';
      return;
    }

    this.portfolioService.createPortfolio(this.newPortfolioName, this.userId).subscribe(
      (response) => {
        this.creationMessage = 'Portfolio created successfully.';
        this.newPortfolioName = ''; // Clear input
        this.getPortfolios(); // Refresh the portfolio list
      },
      (error) => {
        console.error('Error creating portfolio:', error);
        this.creationMessage = error.error?.error || 'Failed to create portfolio.';
      }
    );
  }

 
}
