import { Component, OnInit } from '@angular/core';
import { AnalyseService } from '../../../Services/analyse.service';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import {Router} from "@angular/router";
interface SentimentSentiment {
  ticker: string;
  relevance_score: string;
  positive_sentiment: number;
  negative_sentiment: number;
  neutral_sentiment: number;
  ticker_sentiment_score?: string;
  ticker_sentiment_label?: string;
}
interface Topic {
  topic: string;
  relevance_score: string;
}
interface NewsSentiment {
  feed: Array<{
    title: string;
    url: string;
    time_published: string;
    authors: string[];
    summary: string;
    banner_image: string;
    source: string;
    category_within_source: string;
    topics: Topic[];
    overall_sentiment_score: string;
    overall_sentiment_label: string;
    ticker_sentiment: SentimentSentiment[];
  }>;
}
@Component({
  selector: 'app-analyse',
  templateUrl: './analyse.component.html',
  styleUrls: ['./analyse.component.css'],
})
export class AnalyseComponent implements OnInit {
  symbol: string = ''; // Symbole d'action fourni par l'utilisateur
  errorMessage: string = ''; // Message d'erreur à afficher
  stockData: any = null; // Stock data to display
  // Données API
  recommendationTrends: any = null;
  historicalOptions: any[] = [];
  risk: any = null;
  sentimentAnalysis: NewsSentiment | null = null;

  // Configuration des graphiques
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: 'Catégories' } },
      y: { title: { display: true, text: 'Valeurs' } },
    },
  };

  chartType: ChartType = 'bar'; // Type par défaut des graphiques
  selectedChart: string = ''; // Type de graphique sélectionné

  // Données des graphiques
  recommendationChartData: ChartData<'bar'> = this.initializeBarChartData(
    'Tendances de Recommandation',
    ['rgba(75, 192, 192, 0.5)', 'rgba(255, 159, 64, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(153, 102, 255, 0.5)'],
    ['rgb(75, 192, 192)', 'rgb(255, 159, 64)', 'rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)']
  );

  historicalChartData: ChartData<'bar'> = this.initializeBarChartData(
    'Options Historiques',
    'rgba(255, 99, 132, 0.5)',
    'rgb(255, 99, 132)'
  );

  riskChartData: ChartData<'line'> = this.initializeLineChartData(
    'Évaluation du Risque',
    'rgba(54, 162, 235, 0.5)',
    'rgb(54, 162, 235)'
  );
  sentimentChartData: ChartData<'pie'> = {
    labels: ['Positif', 'Négatif', 'Neutre'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(201, 203, 207, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 1
    }]
  };
  sentimentChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Analyse Sentimentale'
      }
    }
  };

  // Moyennes pour les calculs
  averages: Record<string, number> = this.initializeAverages();
  // private router: any;
  selectedView: string | null = null; // Pour suivre le bouton/clique actif

  constructor(private analyseService: AnalyseService,private router: Router) {}

  ngOnInit(): void {}
  showView(viewName: string): void {
    this.selectedView = viewName;
  }
  // Initialisation des moyennes
  private initializeAverages(): Record<string, number> {
    return {
      last: 0,
      strike: 0,
      delta: 0,
      gamma: 0,
      theta: 0,
      vega: 0,
      ask: 0,
      ask_size: 0,
      bid: 0,
      bid_size: 0,
      mark: 0,
      rho: 0,
      open_interest: 0,
      volume: 0,
    };
  }

  // Initialisation d'un graphique en barres
  private initializeBarChartData(label: string, backgroundColor: string | string[], borderColor: string | string[]): ChartData<'bar'> {
    return {
      labels: [],
      datasets: [
        {
          label,
          data: [],
          backgroundColor,
          borderColor,
        },
      ],
    };
  }

  // Initialisation d'un graphique en lignes
  private initializeLineChartData(label: string, backgroundColor: string, borderColor: string): ChartData<'line'> {
    return {
      labels: [],
      datasets: [
        {
          label,
          data: [],
          backgroundColor,
          borderColor,
          fill: true,
        },
      ],
    };
  }
  private initializePieChart(): ChartData<'pie'> {
    return {
      labels: ['Positif', 'Négatif', 'Neutre'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(201, 203, 207, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(201, 203, 207, 1)'],
          borderWidth: 1,
        },
      ],
    };
  }
  // Validation de l'entrée utilisateur
  private validateSymbol(): boolean {
    if (!this.symbol.trim()) {
      this.errorMessage = 'Veuillez saisir un symbole valide.';
      return false;
    }
    return true;
  }

  // Gestion des erreurs API
  private handleApiError(err: any, message: string): void {
    console.error(message, err);
    this.errorMessage = message;
  }

  // Récupération des tendances de recommandation
  getRecommendationTrends(): void {
    if (this.validateSymbol()) {
      this.analyseService.getRecommendationTrends(this.symbol).subscribe({
        next: (data) => {
          if (data?.symbol && data?.period) {
            this.recommendationTrends = data;
            this.recommendationChartData.labels = ['Buy', 'Strong Buy', 'Hold', 'Sell', 'Strong Sell'];
            this.recommendationChartData.datasets[0].data = [
              data.buy,
              data.strongBuy,
              data.hold,
              data.sell,
              data.strongSell,
            ];
            this.selectedChart = 'recommendation';
          } else {
            this.errorMessage = 'Données de recommandation invalides.';
          }
        },
        error: (err) => this.handleApiError(err, 'Erreur lors de la récupération des tendances de recommandation.'),
      });
    }
  }

// Récupération des options historiques
  getHistoricalOptions(): void {
    if (this.validateSymbol()) {
      this.analyseService.getHistoricalOptions(this.symbol).subscribe({
        next: (response: any) => {
          const validOptions = response?.data?.filter(this.isValidOption.bind(this)) || [];
          if (validOptions.length > 0) {
            this.calculateAverages(validOptions);
            this.historicalChartData.labels = Object.keys(this.averages);
            this.historicalChartData.datasets[0].data = Object.values(this.averages);
            this.historicalOptions = validOptions;  // Stocker les options historiques
            this.selectedChart = 'historical';
          } else {
            this.errorMessage = 'Aucune donnée historique valide disponible.';
          }
        },
        error: (err) => this.handleApiError(err, 'Erreur lors de la récupération des options historiques.'),
      });
    }
  }


  // Validation des options
  private isValidOption(option: any): boolean {
    return (
      option &&
      typeof option === 'object' &&
      Object.keys(this.averages).every((key) => !isNaN(parseFloat(option[key])))
    );
  }

  // Calcul des moyennes
  private calculateAverages(options: any[]): void {
    const totals = { ...this.initializeAverages() };
    options.forEach((option) => {
      Object.keys(totals).forEach((key) => {
        totals[key] += parseFloat(option[key]);
      });
    });
    Object.keys(totals).forEach((key) => {
      this.averages[key] = totals[key] / options.length;
    });
  }

  // Récupération du risque
  getRisk(): void {
    if (this.validateSymbol()) {
      this.analyseService.calculateRisk(this.symbol).subscribe({
        next: (data) => {
          if (data?.date && data?.value) {
            this.riskChartData.labels = [data.date];
            this.riskChartData.datasets[0].data = [data.value];
            this.selectedChart = 'risk';
          } else {
            this.errorMessage = 'Données de risque invalides.';
          }
        },
        error: (err) => this.handleApiError(err, 'Erreur lors de l’évaluation du risque.'),
      });
    }
  }
  loadStockQuote(): void {
    if (this.validateSymbol()) {
      this.analyseService.getStockQuote(this.symbol).subscribe({
      next: (data) => {
        console.log('Données récupérées :', data);
        this.stockData = {
          current: data.c,
          open: data.o,
          high: data.h,
          low: data.l,
          previousClose: data.pc,
          change: data.d,
          changePercent: data.dp,
          timestamp: data.t
        };
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des données :', err);
        this.stockData = null; // Reset on error
      }
    });
  }}
  // Analyse sentimentale
  getSentimentAnalysis(): void {
    if (this.validateSymbol()) {
      this.analyseService.getSentimentAnalysis(this.symbol).subscribe({
        next: (data: NewsSentiment) => {
          this.sentimentAnalysis = data || null;
          this.updateSentimentChart();
        },
        error: (err) => this.handleError(err, 'Erreur lors de l’analyse sentimentale.'),
      });
    }
  }


  updateSentimentChart(): void {
    if (this.sentimentAnalysis && this.sentimentAnalysis.feed.length > 0) {
      // Exemple de récupération de sentiment d'un article
      const article = this.sentimentAnalysis.feed[0];
      const tickerSentiment = article.ticker_sentiment.find(
        (ts) => ts.ticker.toUpperCase() === this.symbol.toUpperCase()
      );

      if (tickerSentiment) {
        const sentimentScore = parseFloat(tickerSentiment.ticker_sentiment_score || '0');
        const sentimentLabel = tickerSentiment.ticker_sentiment_label || 'Neutre';

        let positive = 0, negative = 0, neutral = 0;

        if (sentimentScore >= 0.35) {
          positive = 100;
        } else if (sentimentScore >= 0.15) {
          positive = 70;
          neutral = 30;
        } else if (sentimentScore > -0.15) {
          neutral = 100;
        } else if (sentimentScore > -0.35) {
          negative = 70;
          neutral = 30;
        } else {
          negative = 100;
        }

        this.sentimentChartData.datasets[0].data = [positive, negative, neutral];
        this.sentimentChartOptions.plugins!.title!.text = `Sentiment: ${sentimentLabel}`;
      } else {
        this.sentimentChartData.datasets[0].data = [0, 0, 0];
      }
    } else {
      this.sentimentChartData.datasets[0].data = [0, 0, 0];
    }
  }
  private handleError(err: any, message: string): void {
    console.error(message, err);
    this.errorMessage = message;
  }

  getTotalSentiment(type: 'positive_sentiment' | 'negative_sentiment' | 'neutral_sentiment'): number {
    if (this.sentimentAnalysis && this.sentimentAnalysis.feed.length > 0) {
      const tickerSentiment = this.sentimentAnalysis.feed[0].ticker_sentiment.find(
        ts => ts.ticker.toUpperCase() === this.symbol.toUpperCase()
      );
      if (tickerSentiment) {
        return tickerSentiment[type];
      }
    }
    return 0;
  }

  navigateToAnaf() {
    this.router.navigate(['/anaf']);
  }
}
