import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // This makes the router available throughout the application
    provideRouter(routes),

    // This is required to use HttpClient in our services for API calls
    importProvidersFrom(HttpClientModule),

    // This is required to use ngModel for two-way data binding in our forms
    importProvidersFrom(FormsModule)
  ]
};
