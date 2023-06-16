import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LaborsPageRoutingModule } from "./labors-routing.module";

import { LaborsPage } from "./labors.page";
import { CoreModule, createTranslateLoader } from "@worklog-fe/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";

@NgModule({
  imports: [CoreModule,
            CommonModule, 
            FormsModule, 
            IonicModule, 
            LaborsPageRoutingModule,
            TranslateModule.forChild({
              loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
              }
            }),
          ],
  declarations: [LaborsPage],
})
export class LaborsPageModule {}
