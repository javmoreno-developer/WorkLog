import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LoginPageRoutingModule } from "./login-routing.module";

import { LoginPage } from "./login.page";
import { LoginFormComponent } from "./login-form/login-form.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CoreModule, createTranslateLoader } from "../../../../core/src";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

@NgModule({
  imports: [CommonModule,
            FormsModule,
            IonicModule,
            LoginPageRoutingModule,
            ReactiveFormsModule,
            HttpClientModule,
            CommonModule, 
            FormsModule, 
            IonicModule, 
            CoreModule,
            ReactiveFormsModule,
            TranslateModule.forRoot({
              loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
              }
            }),
          ],
  declarations: [LoginPage, LoginFormComponent],
})
export class LoginPageModule {}
