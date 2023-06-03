import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@worklog-fe/auth/guards";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
      canActivate: [AuthGuard]
  },
  {
    path: "login",
    loadChildren: () =>
      import("@worklog-fe/auth/features").then((m) => m.LoginPageModule),
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./pages/settings/settings.module").then((m) => m.SettingsPageModule)
  },
  {
    path: "modules",
    loadChildren: () =>
      import("./pages/modules/modules.module").then((m) => m.ModulesPageModule)
  },
  {
    path: "students",
    loadChildren: () =>
      import("./pages/students/students.module").then((m) => m.StudentsPageModule)
  },
  {
    path: "student/entries",
    loadChildren: () =>
      import("./pages/entries/entries.module").then((m) => m.EntriesPageModule)
  },
  {
    path: "student/entry/comment",
    loadChildren: () =>
      import("./pages/comments/comments.module").then((m) => m.CommentsPageModule)
  },
  {
    path: "agreements",
    loadChildren: () =>
      import("./pages/agreements/agreements.module").then((m) => m.AgreementsPageModule)
  },
  {
    path: "companies",
    loadChildren: () =>
      import("./pages/companies/companies.module").then((m) => m.CompaniesPageModule)
  },
  {
    path: "units",
    loadChildren: () =>
      import("./pages/units/units.module").then((m) => m.UnitsPageModule)
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})

export class AppRoutingModule {}