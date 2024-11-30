import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ListUserComponent } from './Modules/Views/UserBack/list-user/list-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './Modules/Views/UserFront/register/register.component';
import { LoginComponent } from './Modules/Views/UserFront/login/login.component';
import { ChangePasswordComponent } from './Modules/Views/UserFront/change-password/change-password.component';
import { ForgetPasswordComponent } from './Modules/Views/UserFront/forget-password/forget-password.component';
import { ResetCodeComponent } from './Modules/Views/UserFront/reset-code/reset-code.component';
import { BotChatComponent } from './Modules/Views/UserFront/bot-chat/bot-chat.component';
import { LogoutComponent } from './Modules/Views/UserFront/logout/logout.component';
import { NotFoundComponent } from './Modules/Views/UserFront/not-found/not-found.component';
import { PasswordResetService } from './Modules/Services/password-reset.service';
import { AuthInterceptor } from './Auth/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './Auth/auth.guard';
import { AnalyseTechniqueComponent } from './Modules/Views/UserFront/analyse-technique/analyse-technique.component';
import { BaseChartDirective } from 'ng2-charts';
import { FinancialAnalysisComponent } from './Modules/Views/UserFront/financial-analysis/financial-analysis.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TableModule } from 'primeng/table';
import { AnalyseComponent } from './Modules/Views/UserFront/analyse/analyse.component';
import { registerables } from 'chart.js';
import { Chart } from 'chart.js';
Chart.register(...registerables);  // Register everything you need for charts

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ListUserComponent,
    RegisterComponent,
    LoginComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    ResetCodeComponent,
    BotChatComponent,
    LogoutComponent,
    NotFoundComponent,
    AnalyseTechniqueComponent,
    FinancialAnalysisComponent,
    AnalyseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BaseChartDirective,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    TableModule,
  ],
  providers: [
    AuthGuard,
    PasswordResetService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
