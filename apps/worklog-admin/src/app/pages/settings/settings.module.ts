import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SettingsPageRoutingModule } from "./settings-routing.module";

import { SettingsPage } from "./settings.page";
import { CoreModule } from "@worklog-fe/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SettingsPageRoutingModule, CoreModule],
  declarations: [SettingsPage],
})
export class SettingsPageModule {}
