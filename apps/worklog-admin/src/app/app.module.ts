import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { environment } from "./environments/environment";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CoreModule, LocaleId, createTranslateLoader } from "@worklog-fe/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HTTP } from "@awesome-cordova-plugins/http/ngx";
import { LocaleService } from "libs/core/src/lib/services/locale.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory:(createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  providers: [
    { 
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy 
    },
    {
      provide: 'apiUrlBase',
      useValue: environment.api_url
    },
    {
      provide: "apiHeaders",
      useValue: environment.headers
    },
    {
      provide: LOCALE_ID,
      useClass: LocaleId,
      deps: [LocaleService],
    },
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
