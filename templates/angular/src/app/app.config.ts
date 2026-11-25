import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import Aura from '@exhaustive-ui/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideExhaustive({ theme: { preset: Aura } }),
  ],
};
