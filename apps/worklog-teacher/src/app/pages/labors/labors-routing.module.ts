import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LaborsPage } from "./labors.page";

const routes: Routes = [
  {
    path: "",
    component: LaborsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaborsPageRoutingModule {}
