import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CommentsPageRoutingModule } from "./comments-routing.module";

import { CommentsPage } from "./comments.page";
import { CoreModule, createTranslateLoader } from "@worklog-fe/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    FormsModule, 
    IonicModule, 
    CommentsPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [CommentsPage],
})
export class CommentsPageModule {}
