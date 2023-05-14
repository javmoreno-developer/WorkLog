import { LOCALE_ID, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HTTP } from "@awesome-cordova-plugins/http/ngx";
import { IonicModule, Platform } from "@ionic/angular";
import { createTranslateLoader } from "./utils";
import { LocaleService } from "./services/locale.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableComponent } from "./components/table/table.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { EmptyPopoverComponent } from "./components/empty-popover/empty-popover.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";

export class LocaleId extends String {
  constructor(private localeService: LocaleService) {
    super();
  }

  override toString(): string {
    return this.localeService.locale;
  }

  override valueOf(): string {
    return this.toString();
  }
}

@NgModule({
  declarations: [TableComponent, EmptyPopoverComponent, ToolbarComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableComponent,
    ToolbarComponent
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useClass: LocaleId,
      deps: [LocaleService],
    },
  ],
})
export class CoreModule {}
