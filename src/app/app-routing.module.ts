import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {ListUserComponent} from "./Modules/Views/UserBack/list-user/list-user.component";
import {RegisterComponent} from "./Modules/Views/UserFront/register/register.component";
import {LoginComponent} from "./Modules/Views/UserFront/login/login.component";
import {ChangePasswordComponent} from "./Modules/Views/UserFront/change-password/change-password.component";
import {ForgetPasswordComponent} from "./Modules/Views/UserFront/forget-password/forget-password.component";
import {ResetCodeComponent} from "./Modules/Views/UserFront/reset-code/reset-code.component";
import {BotChatComponent} from "./Modules/Views/UserFront/bot-chat/bot-chat.component";
import {LogoutComponent} from "./Modules/Views/UserFront/logout/logout.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {AnalyseTechniqueComponent} from "./Modules/Views/UserFront/analyse-technique/analyse-technique.component";
import {FinancialAnalysisComponent} from "./Modules/Views/UserFront/financial-analysis/financial-analysis.component";
import {AnalyseComponent} from "./Modules/Views/UserFront/analyse/analyse.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {path:'navbar',component: NavbarComponent},
  { path: 'register', component: RegisterComponent },
  {path:'login', component:LoginComponent},
  {path: 'changepass', component: ChangePasswordComponent },
  {path: 'forgetpass', component: ForgetPasswordComponent },
  {path: 'resetpass', component: ResetCodeComponent },
  {path: 'chatgpt', component: BotChatComponent },
  {path:'logout', component:LogoutComponent},
  {path:'anat', component:AnalyseTechniqueComponent},
  {path:'ana', component:AnalyseComponent},
  {path:'anaf', component:FinancialAnalysisComponent},

  {path:'list-user', component:ListUserComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
