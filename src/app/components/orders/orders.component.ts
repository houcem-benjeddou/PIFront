import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { OrderService, PlaceOrderRequest } from 'src/app/services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';
import { MarketDataService } from 'src/app/services/market-data.service';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { MarketData } from 'src/app/models/market-data';
import { interval, Subscription } from 'rxjs'; // Added for polling mechanism

// Register Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Title, Tooltip);

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrderComponent implements OnInit {
  order: PlaceOrderRequest = {
    portfolioId: 0,
    assetName: '',
    price: 0,
    quantity: 0,
    type: 'BUY',
  };

  message: string = '';
  marketData: MarketData[] = [];
  portfolios: { id: number; name: string }[] = [];
  assetName = '';
  currentPrice: number | null = null;
  isLoading = false;
  userId: number = 1; // Default user ID (set it dynamically if needed)


  pricePollingSubscription!: Subscription; // Added subscription to manage polling


  @ViewChild('lineChart', { static: true }) chartRef!: ElementRef;
  chart: Chart | undefined;
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: '' }],
  };

  constructor(private orderService: OrderService, private marketDataService: MarketDataService, private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.initializeChart();
    // Start polling for updates every 5 seconds
    // Fetch user's portfolios
  this.fetchUserPortfolios();

  interval(5000).subscribe(() => {
    if (this.assetName) {
      this.fetchCurrentPrice(this.assetName); // Fetch current price dynamically
    }
  });
  }


  fetchUserPortfolios(): void {
    this.portfolioService.getPortfoliosByUser(this.userId).subscribe(
      (portfolios) => {
        this.portfolios = portfolios.map((p) => ({ id: p.id, name: p.name }));
      },
      (error) => {
        console.error('Error fetching portfolios:', error);
      }
    );
  }

  fetchCurrentPrice(assetName: string): void {
    this.marketDataService.getCurrentMarketData(assetName).subscribe(
      (currentData) => {
        this.currentPrice = currentData.currentPrice; // Update current price
        const timestamp = new Date(currentData.date).toLocaleString(); // Format timestamp
        this.updateGraph(currentData.currentPrice, timestamp); // Update the graph
      },
      (error) => {
        console.error('Error fetching current market data:', error);
      }
    );
  }

  initializeChart(): void {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: this.lineChartData,
      options: {
        responsive: true,
        scales: {
          x: { ticks: { autoSkip: true, maxTicksLimit: 10 } },
          y: { beginAtZero: true, suggestedMax: 200 },
        },
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            mode: 'nearest',
            intersect: false,
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `${context.dataset.label}: ${value.toFixed(2)}`;
              },
            },
          },
        },
      },
    });
  }

  startPricePolling(assetName: string): void { // Added method for polling the price
    if (!assetName) {
      alert('Please provide a valid asset name.');
      return;
    }

    this.pricePollingSubscription = interval(5000).subscribe(() => { // Poll every 5 seconds
      this.marketDataService.getCurrentMarketData(assetName).subscribe(
        (currentData) => {
          this.currentPrice = currentData.currentPrice; // Update the current price
          
          this.updateGraph(currentData.currentPrice, new Date(currentData.date).toLocaleString()); // Update the graph
        },
        (error) => {
          console.error('Error fetching current market data:', error);
        }
      );
    });
  }

  fetchHistoricalData(assetName: string, filter: string): void {
    if (!assetName) {
      alert('Please provide a valid asset name.');
      return;
    }
  
    this.isLoading = true;
  
    this.marketDataService.getHistoricalData(assetName).subscribe(
      (data) => {
        if (data.length === 0) {
          // Handle case where no data is returned
          alert('No historical data available for the specified asset.');
          this.isLoading = false;
          return;
        }
  
        const filteredData = this.filterData(data, filter); // Filter data based on the selected timeframe
        this.updateChartData(filteredData, assetName); // Update the chart with filtered data
        this.isLoading = false;
      },
      (error) => {
        // Enhanced error handling
        console.error('Error fetching historical data:', error);
        alert('Failed to fetch historical data. Please check your network or the asset name.');
        this.isLoading = false;
      }
    );
  }
  
  filterData(data: MarketData[], filter: string): MarketData[] {
    const now = Date.now();
    let threshold = now;

    switch (filter) {
      case '1hour':
        threshold = now - 1 * 60 * 60 * 1000;
        break;
      case '5hours':
        threshold = now - 5 * 60 * 60 * 1000;
        break;
      case '1day':
        threshold = now - 24 * 60 * 60 * 1000;
        break;
      case '5days':
        threshold = now - 5 * 24 * 60 * 60 * 1000;
        break;
      case '1month':
        threshold = now - 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        return data;
    }

    return data.filter((item) => new Date(item.date).getTime() >= threshold);
  }

  updateChartData(data: MarketData[], label: string): void {
    const dates = data.map((d) => new Date(d.date).toLocaleString());
    const prices = data.map((d) => d.currentPrice);

    this.lineChartData = {
      labels: dates,
      datasets: [
        {
          data: prices,
          label: `Price History for ${label}`,
          borderColor: '#3e95cd',
          pointRadius: 2,
          fill: false,
          tension: 0.4,
        },
      ],
    };

    if (this.chart) {
      this.chart.data = this.lineChartData;
      this.chart.update();
    }
  }

  loadData(assetName: string): void {
    if (!assetName) {
      alert('Please enter a valid asset name');
      return;
    }

    this.isLoading = true;

    this.marketDataService.getHistoricalData(assetName).subscribe(
      (historicalData) => {
        this.marketData = historicalData;
        this.updateChartData(historicalData, assetName);

        this.marketDataService.getCurrentMarketData(assetName).subscribe(
          (currentData) => {
            this.currentPrice = currentData.currentPrice;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching current market data:', error);
            alert('Failed to fetch current price.');
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Error fetching historical data:', error);
        alert('Failed to fetch historical data.');
        this.isLoading = false;
      }
    );
  }

  updateGraph(price: number, timestamp: string): void {
    if (this.chart) {
      // Ensure labels and datasets are initialized
      if (!this.chart.data.labels) {
        this.chart.data.labels = []; // Initialize labels if undefined
      }
  
      if (!this.chart.data.datasets[0].data) {
        this.chart.data.datasets[0].data = []; // Initialize dataset data if undefined
      }
  
      // Add new timestamp and price
      this.chart.data.labels.push(timestamp); // Add new timestamp
      (this.chart.data.datasets[0].data as number[]).push(price); // Add new price (cast to number[])
  
      // Keep the graph limited to 50 points
      if (this.chart.data.labels.length > 50) {
        this.chart.data.labels.shift(); // Remove the oldest timestamp
        (this.chart.data.datasets[0].data as number[]).shift(); // Remove the oldest price
      }
  
      this.chart.update(); // Refresh the chart
    }
  }
  
  placeOrder(): void {
    this.order.assetName = this.assetName; // Auto-fill asset name
    this.order.price = this.currentPrice || 0; // Use current price
    this.orderService.placeOrder(this.order).subscribe(
      () => {
        const totalPrice = (this.order.price * this.order.quantity).toFixed(2);
      this.message = `Order placed successfully! Type: ${this.order.type}, Quantity: ${this.order.quantity}, 
                      Price: ${this.order.price.toFixed(2)}, Total: ${totalPrice}`;
      this.order.quantity = 0; // Clear quantity input
      },
      (error) => {
        console.error('Error placing order:', error);
        this.message = 'Failed to place order.';
      }
    );
  }
}
