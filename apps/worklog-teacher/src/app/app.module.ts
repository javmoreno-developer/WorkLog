import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CoreModule, LocaleId, createTranslateLoader } from "@worklog-fe/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { LocaleService } from "libs/core/src/lib/services/locale.service";
import { environment } from "./environments/environment";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    CoreModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory:(createTranslateLoader),
        deps: [HttpClient]
      }
    }),
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
  bootstrap: [AppComponent],
})
export class AppModule {}
