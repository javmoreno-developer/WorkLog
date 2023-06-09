import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@worklog-fe/auth/guards";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./pages/dashboard/dashboard.module").then((m) => m.DashboardPageModule),
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
      import("./pages/settings/settings.module").then((m) => m.SettingsPageModule),
      canActivate: [AuthGuard]
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
    path: "teachers",
    loadChildren: () =>
      import("./pages/teachers/teachers.module").then((m) => m.TeachersPageModule)
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./pages/profiles/profiles.module").then((m) => m.ProfilesPageModule)
  },
  {
    path: "labors",
    loadChildren: () =>
      import("./pages/labors/labors.module").then((m) => m.LaborsPageModule)
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