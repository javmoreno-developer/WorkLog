import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AgreementsPage } from "./agreements.page";

const routes: Routes = [
  {
    path: "",
    component: AgreementsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementsPageRoutingModule {}
