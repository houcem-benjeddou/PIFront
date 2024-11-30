import { Component, OnInit } from '@angular/core';
import { AnalyseService } from '../../../Services/analyse.service';
import { ChartOptions, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-analyse',
  templateUrl: './analyse.component.html',
  styleUrls: ['./analyse.component.css'],
})
export class AnalyseComponent implements OnInit {
  symbol: string = ''; // Symbole d'action saisi par l'utilisateur
  errorMessage: string = ''; // Message d'erreur pour l'utilisateur

  // Données API
  recommendationTrends: any = null;
  historicalOptions: any[] = [];
  risk: any = null;
  sentimentAnalysis: string | null = null;

  // Données des graphiques
  recommendationChartData: ChartData<'line'> = this.initializeChartData(
    'Tendances de recommandation (Buy)',
    'rgb(75, 192, 192)',
    'rgba(75, 192, 192, 0.2)'
  );
  historicalChartData: ChartData<'line'> = this.initializeChartData(
    'Options historiques',
    'rgb(255, 99, 132)',
    'rgba(255, 99, 132, 0.2)'
  );
  riskChartData: ChartData<'line'> = this.initializeChartData(
    'Évaluation du risque',
    'rgb(54, 162, 235)',
    'rgba(54, 162, 235, 0.2)'
  );

  // Configuration des graphiques
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Valeur' } },
    },
  };
  chartType: ChartType = 'line';
  selectedChart: string = ''; // Le graphique sélectionné

  constructor(private analyseService: AnalyseService) {}

  ngOnInit(): void {}

  // Initialisation des données des graphiques
  initializeChartData(
    label: string,
    borderColor: string,
    backgroundColor: string
  ): ChartData<'line'> {
    return {
      labels: [],
      datasets: [
        {
          label,
          data: [],
          borderColor,
          backgroundColor,
          fill: false,
        },
      ],
    };
  }

  // Gestion des erreurs d'API
  handleApiError(err: any, message: string): void {
    console.error(message, err);
    this.errorMessage = message;
  }

  // Validation du symbole
  validateSymbol(): boolean {
    if (!this.symbol.trim()) {
      this.errorMessage = 'Veuillez saisir un symbole valide.';
      return false;
    }
    return true;
  }

  // Récupération des tendances de recommandation
  getRecommendationTrends(): void {
    if (this.validateSymbol()) {
      this.analyseService.getRecommendationTrends(this.symbol).subscribe({
        next: (data) => {
          if (data?.period && data.buy !== undefined) {
            this.recommendationTrends = data;
            this.recommendationChartData.labels = [data.period];
            this.recommendationChartData.datasets[0].data = [data.buy];
            this.selectedChart = 'recommendation';
          } else {
            this.errorMessage = 'Données de recommandation invalides.';
          }
        },
        error: (err) =>
          this.handleApiError(
            err,
            'Erreur lors de la récupération des tendances de recommandation.'
          ),
      });
    }
  }

  // Récupération des options historiques
  getHistoricalOptions(): void {
    if (this.validateSymbol()) {
      this.analyseService.getHistoricalOptions(this.symbol).subscribe({
        next: (response: any) => {
          console.log('Données brutes reçues du backend:', response);

          const rawData = response?.data;

          // Vérification si 'data' existe et est un tableau
          if (!rawData || !Array.isArray(rawData)) {
            this.errorMessage = 'Format de réponse invalide du backend.';
            console.error('Réponse inattendue:', response);
            return;
          }

          // Affichage des données brutes pour déboguer
          console.log('Raw options:', rawData);

          // Filtrage des options valides
          const validOptions = rawData.filter((item, index) => {
            const isValid = this.isValidOption(item);
            if (!isValid) {
              console.warn(`Option invalide à l'index ${index}:`, item);
            }
            return isValid;
          });

          console.log('Options valides après filtrage:', validOptions);

          if (validOptions.length > 0) {
            // Calcul de la moyenne des valeurs 'last' des options valides
            const sum = validOptions.reduce((acc, opt) => acc + parseFloat(opt.last), 0); // Assurez-vous que 'last' est un nombre
            const average = sum / validOptions.length;

            console.log('Moyenne des options historiques:', average);

            // Mise à jour des données du graphique
            this.historicalOptions = [{ expiration: 'Moyenne', last: average }];
            this.historicalChartData.labels = ['Moyenne des options']; // Label du graphique
            this.historicalChartData.datasets[0].data = [average]; // Données du graphique

            this.selectedChart = 'historical'; // Afficher ce graphique
          } else {
            this.errorMessage = 'Aucune donnée historique valide disponible.';
            console.warn('Aucune option valide trouvée.');
          }
        },
        error: (err) =>
          this.handleApiError(
            err,
            'Erreur lors de la récupération des options historiques.'
          ),
      });
    }
  }

  // Validation des options
  private isValidOption(item: any): boolean {
    console.log('Option en cours de validation:', item); // Affichage des options pour débogage

    // Vérification de la présence des propriétés nécessaires
    if (!item || typeof item !== 'object') {
      console.warn("L'option n'est pas un objet valide.");
      return false;
    }

    // Convertir 'last' et 'strike' en nombre
    const lastValue = parseFloat(item.last);
    const strikeValue = parseFloat(item.strike);

    // Validation des valeurs numériques
    if (isNaN(lastValue) || isNaN(strikeValue)) {
      console.warn(`'last' ou 'strike' ne sont pas des nombres valides. last: ${item.last}, strike: ${item.strike}`);
      return false; // Si 'last' ou 'strike' ne sont pas des nombres valides, l'option est invalide
    }

    // Vérification des autres propriétés
    return (
      item.contractID && // Assurez-vous que contractID existe et n'est pas vide
      typeof item.contractID === 'string' &&
      item.type && // Vérifiez que le type existe
      typeof item.type === 'string' &&
      item.expiration && // Vérifiez que la date d'expiration existe
      typeof item.expiration === 'string' &&
      item.last !== undefined && // Vérifiez que 'last' est défini (et n'est pas null)
      typeof item.last === 'string' && // 'last' est une chaîne dans la réponse, vérifions cela avant de le convertir
      item.strike && // Vérifiez que 'strike' existe
      typeof item.strike === 'string' // 'strike' est également une chaîne dans la réponse
    );
  }



  // Récupération des données de risque
  getRisk(): void {
    if (this.validateSymbol()) {
      this.analyseService.calculateRisk(this.symbol).subscribe({
        next: (data) => {
          if (data?.date && data?.value) {
            this.riskChartData.labels = [data.date];
            this.riskChartData.datasets[0].data = [data.value];
            this.selectedChart = 'risk';
          } else {
            this.errorMessage = 'Les données de risque sont invalides.';
          }
        },
        error: (err) =>
          this.handleApiError(err, 'Erreur lors de l’évaluation du risque.'),
      });
    }
  }

  // Analyse sentimentale
  getSentimentAnalysis(): void {
    if (this.validateSymbol()) {
      this.analyseService.getSentimentAnalysis(this.symbol).subscribe({
        next: (data) => {
          this.sentimentAnalysis = data || 'Aucune analyse disponible.';
          this.selectedChart = 'sentiment';
        },
        error: (err) =>
          this.handleApiError(
            err,
            'Erreur lors de l’analyse sentimentale.'
          ),
      });
    }
  }
}
