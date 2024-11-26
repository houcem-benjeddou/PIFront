import { Component, OnInit } from '@angular/core';
import { AnalyseService } from "../../../Services/analyse.service";

@Component({
  selector: 'app-analyse-technique',
  templateUrl: './analyse-technique.component.html',
  styleUrls: ['./analyse-technique.component.css']
})
export class AnalyseTechniqueComponent implements OnInit {
  stockData: any = null; // Stock data to display
  symbol: string = 'AAPL'; // Default symbol

  constructor(private analyseService: AnalyseService) {}

  ngOnInit(): void {
    this.loadStockQuote(this.symbol);
  }

  loadStockQuote(symbol: string): void {
    this.analyseService.getStockQuote(symbol).subscribe({
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
  }

  searchSymbol(): void {
    if (this.symbol) {
      this.loadStockQuote(this.symbol.trim());
    }
  }
}
