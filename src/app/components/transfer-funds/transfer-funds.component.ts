import { Component } from '@angular/core';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transfer-funds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-funds.component.html',
  styleUrls: ['./transfer-funds.component.css']
})
export class TransferFundsComponent {
  userId: number = 0;
  portfolioId: number = 0;
  amount: number = 0;
  direction: string = '';
  message: string = '';
  isLoading: boolean = false;


  constructor(private portfolioService: PortfolioService) {}

  onSubmit(): void {
    if (this.direction !== 'toPortfolio' && this.direction !== 'toUser') {
      this.message = 'Invalid transfer direction. Use "toPortfolio" or "toUser".';
      return;
    }

    this.portfolioService.transferFunds(this.userId, this.portfolioId, this.amount, this.direction)
      .subscribe({
        next: (response) => {
          this.message = 'Funds transferred successfully.';
        },
        error: (error) => {
          this.message = 'Transfer failed: ' + error.error;
        }
      });
      if (!this.userId || !this.portfolioId || !this.amount) {
        this.message = 'All fields are required!';
        return;
      }
  
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.message = 'Funds transferred successfully!';
      }, 2000); // Simulate a server request
  }
  
}
