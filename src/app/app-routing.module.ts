import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './components/portfolios/portfolios.component';
import { OrderComponent } from './components/orders/orders.component';
import { MarketDataComponent } from './components/market-data/market-data.component';
import { TransferFundsComponent } from './components/transfer-funds/transfer-funds.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'portfolios', component: PortfolioComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'market', component: MarketDataComponent },
  { path: 'transfer-funds', component: TransferFundsComponent },
  { path: 'home', component: HomeComponent},
  { path: '**', redirectTo: '/users' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}