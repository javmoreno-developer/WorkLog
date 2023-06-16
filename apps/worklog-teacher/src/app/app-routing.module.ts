import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@worklog-fe/auth/guards";

const routes: Routes = [
  {
    path: "home",
    redirectTo: "students",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("@worklog-fe/auth/features").then((m) => m.LoginPageModule),
  },
  {
    path: "students",
    loadChildren: () =>
      import("./pages/students/students.module").then((m) => m.StudentsPageModule),
      canActivate: [AuthGuard]
  },
  {
    path: "student/entries",
    loadChildren: () =>
      import("./pages/entries/entries.module").then((m) => m.EntriesPageModule),
      canActivate: [AuthGuard]
  },
  {
    path: "student/entry/comment",
    loadChildren: () =>
      import("./pages/comments/comments.module").then((m) => m.CommentsPageModule),
      canActivate: [AuthGuard]
  },
  {
    path: "companies",
    loadChildren: () =>
      import("./pages/companies/companies.module").then((m) => m.CompaniesPageModule),
      canActivate: [AuthGuard]
  },
  {
    path: "teachers",
    loadChildren: () =>
      import("./pages/teachers/teachers.module").then((m) => m.TeachersPageModule),
      canActivate: [AuthGuard]
  },
  {
    path: "labors",
    loadChildren: () =>
      import("./pages/labors/labors.module").then((m) => m.LaborsPageModule),
      canActivate: [AuthGuard]
  },
  {
    path: "agreements",
    loadChildren: () =>
      import("./pages/agreements/agreements.module").then((m) => m.AgreementsPageModule),
      canActivate: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "students",
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
