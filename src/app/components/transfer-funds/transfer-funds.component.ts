import { Component, OnInit} from '@angular/core';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Portfolio } from 'src/app/models/portfolio.model';

@Component({
  selector: 'app-transfer-funds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-funds.component.html',
  styleUrls: ['./transfer-funds.component.css']
})
export class TransferFundsComponent implements OnInit {
  portfolios: Portfolio[] = []; // List of portfolios
  selectedPortfolioId: number = 0; // Selected portfolio ID
  amount: number = 0; // Amount to transfer
  direction: string = 'toPortfolio'; // Transfer direction
  message: string = ''; // Success or error message
  isLoading: boolean = false; // Loading state
  userId: number = 1; // Fixed user ID

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.fetchPortfolios(); // Fetch portfolios on component initialization
  }

  fetchPortfolios(): void {
    this.isLoading = true;
    this.portfolioService.getPortfoliosByUser(this.userId).subscribe(
      (data) => {
        this.portfolios = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching portfolios:', error);
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (!this.selectedPortfolioId || !this.amount || !this.direction) {
      this.message = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.portfolioService
      .transferFunds(this.userId, this.selectedPortfolioId, this.amount, this.direction)
      .subscribe(
        (response) => {
          this.message = 'Funds transferred successfully!';
          this.isLoading = false;
        },
        (error) => {
          console.error('Error transferring funds:', error);
          this.message = 'Failed to transfer funds.';
          this.isLoading = false;
        }
      );
  }
}