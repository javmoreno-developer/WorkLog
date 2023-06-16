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
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { EntryComponent } from "./components/entry/entry.component";
import { EmptyModalComponent } from "./components/empty-modal/empty-modal.component";
import { AssesmentAdminComponent } from "./components/assesment-admin/assesment-admin.component";
import { DurationAdminComponent } from "./components/duration-admin/duration-admin.component";
import { DatabaseManageAdminComponent } from "./components/database-manage-admin/database-manage-admin.component";
import { HolidayAdminComponent } from "./components/holiday-admin/holiday-admin.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SwiperModule } from "swiper/angular";
import { EmptySwiperComponent } from "./components/empty-swiper/empty-swiper.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { FilterComponent } from "./filter/filter.component";

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
  declarations: [
    TableComponent,
    EmptyPopoverComponent,
    ToolbarComponent,
    SidebarComponent,
    EntryComponent,
    EmptyModalComponent,
    AssesmentAdminComponent,
    DurationAdminComponent,
    DatabaseManageAdminComponent,
    HolidayAdminComponent,
    FooterComponent,
    EmptySwiperComponent,
    FilterComponent,
    ProfileComponent,
    FilterComponent,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
    SwiperModule,
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
    ToolbarComponent,
    SidebarComponent,
    EntryComponent,
    EmptyModalComponent,
    AssesmentAdminComponent,
    DurationAdminComponent,
    DatabaseManageAdminComponent,
    HolidayAdminComponent,
    FooterComponent,
    FilterComponent,
    ProfileComponent,
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
