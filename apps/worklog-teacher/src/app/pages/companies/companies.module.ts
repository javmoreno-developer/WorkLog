import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CompaniesPageRoutingModule } from "./companies-routing.module";

import { CompaniesPage } from "./companies.page";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { CoreModule, createTranslateLoader } from "@worklog-fe/core";
import { HttpClient } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    CoreModule,
    IonicModule, 
    CompaniesPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory:(createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [CompaniesPage],
})
export class CompaniesPageModule {}
