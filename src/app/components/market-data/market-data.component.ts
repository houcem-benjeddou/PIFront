import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Title, Tooltip);

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.css'],
})
export class MarketDataComponent implements OnInit {
  marketData: any[] = [];
  assetName = '';
  currentPrice: number | null = null;
  isLoading = false;
  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [{ data: [], label: '' }] };

  @ViewChild('lineChart', { static: true }) chartRef!: ElementRef;
  chart: Chart | undefined;

  // Admin-related properties
  newAssetName = '';
  creationMessage = '';
  assets: string[] = [];
  assetTrends: { [key: string]: string } = {};
  searchQuery = ''; // To store the search query
  selectedAsset: string | null = null; // To store the currently selected asset



  constructor(private marketDataService: MarketDataService) {}

  ngOnInit(): void {
    this.initializeChart();
    this.fetchAssets();
  }

  private initializeChart(): void {
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
              label: (context) => `${context.dataset.label}: ${(context.raw as number).toFixed(2)}`,
            },
          },
        },
      },
    });
  }

  private updateChartData(data: any[], label: string): void {
    const dates = data.map((d) =>
      new Date(d.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    );
    const prices = data.map((d) => d.currentPrice);

    this.lineChartData = {
      labels: dates,
      datasets: [
        {
          data: prices,
          label: `Price History for ${label}`,
          borderColor: '#3e95cd',
          pointRadius: 2,
          pointHoverRadius: 4,
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

  fetchAssets(): void {
    this.marketDataService.getAllAssets().subscribe(
      (assets) => {
        this.assets = assets;
        for (const asset of assets) {
          this.assetTrends[asset] = 'STABLE'; // Default trend
        }
      },
      (error) => {
        console.error('Error fetching assets:', error);
      }
    );
  }

  filteredAssets(): string[] {
    return this.assets.filter((asset) =>
      asset.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onAssetSelect(): void {
    // When an asset is selected from the dropdown
    console.log(`Selected asset: ${this.selectedAsset}`);
  }

  updateTrend(asset: string): void {
    const trend = this.assetTrends[asset];
    this.marketDataService.setAssetTrend(asset, trend).subscribe(
      () => alert(`Trend for ${asset} updated to ${trend}`),
      (error) => {
        console.error('Error updating trend:', error);
        alert('Failed to update trend. Please try again.');
      }
    );
  }


  private initializeTrends(): void {
    for (const asset of this.assets) {
      if (!this.assetTrends[asset]) {
        this.assetTrends[asset] = 'STABLE';
      }
    }
  }

  fetchHistoricalData(assetName: string, filter: string): void {
    this.isLoading = true;
    this.marketDataService.getHistoricalData(assetName).subscribe(
      (data) => {
        const filteredData = this.filterData(data, filter);
        this.updateChartData(filteredData, assetName);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching historical data:', error);
        alert('Failed to fetch historical data. Please try again.');
        this.isLoading = false;
      }
    );
  }

  private filterData(data: any[], filter: string): any[] {
    const now = new Date().getTime();
    const timeRanges: { [key: string]: number } = {
      '1hour': 1 * 60 * 60 * 1000,
      '5hours': 5 * 60 * 60 * 1000,
      '1day': 24 * 60 * 60 * 1000,
      '5days': 5 * 24 * 60 * 60 * 1000,
      '1month': 30 * 24 * 60 * 60 * 1000,
    };

    return filter in timeRanges
      ? data.filter((d) => new Date(d.date).getTime() >= now - timeRanges[filter])
      : data;
  }

  loadData(selectedAsset: string | null): void {
    if (!selectedAsset || selectedAsset.trim() === '') {
      alert('Please select a valid asset');
      return;
    }

    this.isLoading = true;

    this.marketDataService.getHistoricalData(selectedAsset).subscribe(
      (historicalData) => {
        this.marketData = historicalData;
        this.updateChartData(historicalData, selectedAsset);

        this.marketDataService.getCurrentMarketData(selectedAsset).subscribe(
          (currentData) => {
            this.currentPrice = currentData.currentPrice;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching current market data:', error);
            alert('Failed to fetch current price. Please try again.');
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Error fetching historical data:', error);
        alert('Failed to fetch historical data. Please try again.');
        this.isLoading = false;
      }
    );
  }

  addNewAsset(): void {
    if (!this.newAssetName.trim()) {
      alert('Please enter a valid asset name');
      return;
    }

    this.isLoading = true;
    this.marketDataService.addAsset(this.newAssetName).subscribe(
      (response) => {
        this.creationMessage = response.message;
        this.newAssetName = '';
        this.fetchAssets();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error adding asset:', error);
        this.creationMessage = error.error?.error || 'Failed to create asset. Please try again.';
        this.isLoading = false;
      }
    );
  }
}
