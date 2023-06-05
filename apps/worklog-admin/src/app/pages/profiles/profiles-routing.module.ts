import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProfilesPage } from "./profiles.page";

const routes: Routes = [
  {
    path: "",
    component: ProfilesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilesPageRoutingModule {}
