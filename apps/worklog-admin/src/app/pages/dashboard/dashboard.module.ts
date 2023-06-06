import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DashboardPageRoutingModule } from "./dashboard-routing.module";

import { DashboardPage } from "./dashboard.page";
import { CoreModule, createTranslateLoader } from "@worklog-fe/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";

@NgModule({
  imports: [CoreModule,
            CommonModule, 
            FormsModule, 
            IonicModule, 
            DashboardPageRoutingModule,
            TranslateModule.forChild({
              loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
              }
            }),
          ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
