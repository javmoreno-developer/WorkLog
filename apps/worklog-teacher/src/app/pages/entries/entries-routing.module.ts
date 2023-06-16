import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { EntriesPage } from "./entries.page";

const routes: Routes = [
  {
    path: "",
    component: EntriesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntriesPageRoutingModule {}
