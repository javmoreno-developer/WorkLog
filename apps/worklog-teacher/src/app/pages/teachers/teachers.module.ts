import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TeachersPageRoutingModule } from "./teachers-routing.module";

import { TeachersPage } from "./teachers.page";
import { CoreModule, createTranslateLoader } from "@worklog-fe/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";

@NgModule({
  imports: [
    CoreModule,
    CommonModule, 
    FormsModule, 
    IonicModule, 
    TeachersPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory:(createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [TeachersPage],
})
export class TeachersPageModule {}
