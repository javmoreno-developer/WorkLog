import { NgModule } from "@angular/core";
import { LoginPageRoutingModule } from "./login-routing.module";

import { LoginPage } from "./login.page";
import { LoginFormComponent } from "./login-form/login-form.component";
import { HttpClient } from "@angular/common/http";
import { CoreModule, createTranslateLoader } from "../../../../core/src";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { ResetPassComponent } from "./reset-pass/reset-pass.component";

@NgModule({
  imports: [
    CoreModule,
    LoginPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    LoginPage,
    LoginFormComponent,
    ResetPassComponent
  ],
})
export class LoginPageModule {}
