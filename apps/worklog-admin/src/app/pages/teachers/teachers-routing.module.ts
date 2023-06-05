import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TeachersPage } from "./teachers.page";

const routes: Routes = [
  {
    path: "",
    component: TeachersPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeachersPageRoutingModule {}
