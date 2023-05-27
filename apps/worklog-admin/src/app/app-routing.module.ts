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