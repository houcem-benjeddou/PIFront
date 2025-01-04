import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Add HTTP Client here
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Import the routes

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()     // Provide HTTP Client if needed
  ]
})
.catch((err) => console.error(err));
