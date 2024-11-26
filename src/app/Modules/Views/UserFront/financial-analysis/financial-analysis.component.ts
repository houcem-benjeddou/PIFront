import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {AnalyseService} from "../../../Services/analyse.service";

@Component({
  selector: 'app-financial-analysis',
  templateUrl: './financial-analysis.component.html',
  styleUrls: ['./financial-analysis.component.css'],
})
export class FinancialAnalysisComponent implements OnInit {
  symbol: string = 'AAPL'; // Symbole d'entreprise par défaut
  financialData: any = {}; // Données financières récupérées depuis l'API
  chart: any; // Instance du graphique
  searchSymbol: string = ''; // Champ de recherche utilisateur

  constructor(private analyseService: AnalyseService) {
    Chart.register(...registerables); // Enregistre les composants nécessaires pour Chart.js
  }

  ngOnInit(): void {
    this.loadFinancialData(this.symbol); // Charger les données pour le symbole par défaut
  }

  loadFinancialData(symbol: string): void {
    this.analyseService.getBasicFinancials(symbol).subscribe(
      (data: any) => {
        this.financialData = data.metric || {}; // Charge les données récupérées dans l'objet
        this.createChart(this.financialData); // Crée un graphique basé sur les données
      },
      (error) => {
        console.error('Erreur lors de la récupération des données financières :', error);
        this.financialData = null; // Réinitialise les données en cas d'erreur
        if (this.chart) this.chart.destroy(); // Supprime le graphique s'il existe
      }
    );
  }

  searchFinancialData(): void {
    if (this.searchSymbol.trim()) {
      this.symbol = this.searchSymbol.trim(); // Met à jour le symbole
      this.loadFinancialData(this.symbol); // Charge les données pour le nouveau symbole
    }
  }

  createChart(metrics: any): void {
    const labels = Object.keys(metrics); // Utilise les clés des données financières comme labels
    const values = Object.values(metrics).map((val: any) => parseFloat(val) || 0); // Construit les valeurs numériques

    if (this.chart) {
      this.chart.destroy(); // Détruit l'ancien graphique s'il existe
    }

    const ctx = document.getElementById('financialChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Données financières clés',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valeur',
            },
          },
        },
      },
    });
  }
}
