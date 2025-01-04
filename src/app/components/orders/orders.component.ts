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
import { MarketData } from 'src/app/models/market-data';

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
  assetName = '';
  currentPrice: number | null = null;
  isLoading = false;

  @ViewChild('lineChart', { static: true }) chartRef!: ElementRef;
  chart: Chart | undefined;
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: '' }],
  };

  constructor(private orderService: OrderService, private marketDataService: MarketDataService) {}

  ngOnInit(): void {
    this.initializeChart();
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

  fetchHistoricalData(assetName: string, filter: string): void {
    if (!assetName) {
      alert('Please provide a valid asset name.');
      return;
    }

    this.isLoading = true;

    this.marketDataService.getHistoricalData(assetName).subscribe(
      (data) => {
        const filteredData = this.filterData(data, filter);
        this.updateChartData(filteredData, assetName);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching historical data:', error);
        alert('Failed to fetch historical data.');
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

  placeOrder(): void {
    this.order.price = this.currentPrice || 0; // Use current price
    this.orderService.placeOrder(this.order).subscribe(
      () => {
        this.message = 'Order placed successfully!';
      },
      (error) => {
        console.error('Error placing order:', error);
        this.message = 'Failed to place order.';
      }
    );
  }
}
