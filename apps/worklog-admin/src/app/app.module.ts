import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { environment } from "./environments/environment";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "@worklog-fe/core";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,CoreModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },{provide: 'apiUrlBase', useValue: environment.api_url},{provide: "apiHeaders", useValue: environment.headers}],
  bootstrap: [AppComponent],
})
export class AppModule {}
