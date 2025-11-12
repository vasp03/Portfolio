import { bootstrapApplication } from "@angular/platform-browser";
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from "@angular/router";
import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular/standalone";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { routes } from "./app/app.routes";
import { AppComponent } from "./app/app.component";
import { importProvidersFrom, isDevMode } from "@angular/core";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from "@ngx-translate/http-loader";

import { HttpClient } from "@angular/common/http";
import { provideServiceWorker } from '@angular/service-worker';

export function HttpLoaderFactory() {
  return new TranslateHttpLoader();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: "en",
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: "./assets/languages/",
        suffix: ".json",
      },
    }, provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
});
