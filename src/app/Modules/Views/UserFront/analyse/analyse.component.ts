import { Component, OnInit } from '@angular/core';
import { AnalyseService } from "../../../Services/analyse.service";
import { ChartOptions, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-analyse',
  templateUrl: './analyse.component.html',
  styleUrls: ['./analyse.component.css'],
})
export class AnalyseComponent implements OnInit {
  symbol: string = ''; // Symbole de l'action
  recommendationTrends: any = null; // Tendances de recommandation
  historicalOptions: any = null; // Options historiques
  risk: any = null; // Évaluation du risque
  sentimentAnalysis: any = null; // Analyse sentimentale
  errorMessage: string = ''; // Message d'erreur

  // Configuration du graphique
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Valeur' } },
    },
  };
  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Données financières',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  };
  chartType: ChartType = 'line';

  constructor(private analyseService: AnalyseService) {}

  ngOnInit(): void {}

  // Méthode pour obtenir les tendances de recommandation
  // Méthode pour obtenir les tendances de recommandation
  getRecommendationTrends(): void {
    if (this.symbol) {
      this.analyseService.getRecommendationTrends(this.symbol).subscribe({
        next: (data) => {
          try {
            const parsedData = JSON.parse(data); // Parser la chaîne en un objet
            this.recommendationTrends = parsedData;
            this.chartData.labels = parsedData.dates; // Par exemple, dates
            this.chartData.datasets[0].data = parsedData.values; // Par exemple, valeurs des tendances
          } catch (error) {
            this.errorMessage = 'Erreur lors de la parsing des données des tendances de recommandation';
          }
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la récupération des tendances de recommandation';
        },
      });
    }
  }

// Méthode pour obtenir les options historiques
  getHistoricalOptions(): void {
    if (this.symbol) {
      this.analyseService.getHistoricalOptions(this.symbol).subscribe({
        next: (data) => {
          this.historicalOptions = data;  // Pas besoin de JSON.parse si les données sont déjà en JSON
          this.chartData.labels = data.dates;
          this.chartData.datasets[0].data = data.values;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la récupération des options historiques';
        },
      });
    }
  }

// Méthode pour obtenir l'évaluation du risque
  getRisk(): void {
    if (this.symbol) {
      this.analyseService.calculateRisk(this.symbol).subscribe({
        next: (data) => {
          try {
            const parsedData = JSON.parse(data);
            this.risk = parsedData;
            this.chartData.datasets[0].data = parsedData.riskValues;
          } catch (error) {
            this.errorMessage = 'Erreur lors de la parsing de l\'évaluation du risque';
          }
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'évaluation du risque';
        },
      });
    }
  }

// Méthode pour obtenir l'analyse sentimentale
  getSentimentAnalysis(): void {
    if (this.symbol) {
      this.analyseService.getSentimentAnalysis(this.symbol).subscribe({
        next: (data) => {
          try {
            const parsedData = JSON.parse(data);
            this.sentimentAnalysis = parsedData;
            this.chartData.datasets[0].data = parsedData.sentimentScores;
          } catch (error) {
            this.errorMessage = 'Erreur lors de la parsing de l\'analyse sentimentale';
          }
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la récupération de l\'analyse sentimentale';
        },
      });
    }
  }

}
