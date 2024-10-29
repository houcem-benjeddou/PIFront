import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ListUserComponent } from './Modules/Views/UserBack/list-user/list-user.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './Modules/Views/UserFront/register/register.component';
import { LoginComponent } from './Modules/Views/UserFront/login/login.component';
import { ChangePasswordComponent } from './Modules/Views/UserFront/change-password/change-password.component';
import { ForgetPasswordComponent } from './Modules/Views/UserFront/forget-password/forget-password.component';
import { ResetCodeComponent } from './Modules/Views/UserFront/reset-code/reset-code.component';
import { BotChatComponent } from './Modules/Views/UserFront/bot-chat/bot-chat.component';
import { LogoutComponent } from './Modules/Views/UserFront/logout/logout.component';
import {NotFoundComponent} from "./Modules/Views/UserFront/not-found/not-found.component";
import {PasswordResetService} from "./Modules/Services/password-reset.service";
import {AuthInterceptor} from "./Auth/auth.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthGuard} from "./Auth/auth.guard";

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
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [ AuthGuard,
    PasswordResetService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
