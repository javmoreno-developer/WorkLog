import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { IonicModule, Platform } from '@ionic/angular';
import { createTranslateLoader } from './utils';
import { LocaleService } from './services/locale.service';

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
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useClass: LocaleId,
    deps: [LocaleService],
    },
  ],
  exports:[HttpClientModule,TranslateModule]
})
export class CoreModule {}