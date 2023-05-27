import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ModulesPageRoutingModule } from "./modules-routing.module";

import { ModulesPage } from "./modules.page";
import { CoreModule, createTranslateLoader } from "@worklog-fe/core";
import { SettingsPageRoutingModule } from "../settings/settings-routing.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModulesPageRoutingModule,
    CoreModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [ModulesPage],
})
export class ModulesPageModule {}
