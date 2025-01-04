import { Routes } from '@angular/router';
import { PortfolioComponent } from './components/portfolios/portfolios.component';
import { OrderComponent } from './components/orders/orders.component';
import { AssetsComponent } from './components/assets/assets.component';
import { MarketDataComponent } from './components/market-data/market-data.component';
import { TransferFundsComponent } from './components/transfer-funds/transfer-funds.component';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
  { path: 'portfolios', component: PortfolioComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'assets', component: AssetsComponent },
  { path: 'market', component: MarketDataComponent },
  { path: 'transfer-funds', component: TransferFundsComponent }, // Add Buy Order route
  { path: 'home', component: HomeComponent }, // Add Buy Order route
];
