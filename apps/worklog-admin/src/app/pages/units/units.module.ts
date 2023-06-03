import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { UnitsPageRoutingModule } from "./units-routing.module";

import { UnitsPage } from "./units.page";
import { CoreModule, createTranslateLoader } from "@worklog-fe/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";

@NgModule({
  imports: [CoreModule,
            CommonModule, 
            FormsModule, 
            IonicModule, 
            UnitsPageRoutingModule,
            TranslateModule.forChild({
              loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
              }
            }),
          ],
  declarations: [UnitsPage],
})
export class UnitsPageModule {}
