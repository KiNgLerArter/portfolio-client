import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard, NoAuthGuard } from "@shared/lib/auth";
import { HomePageComponent } from "./home";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    component: HomePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    loadComponent: () => import("./login").then((m) => m.LoginPageComponent),
    canLoad: [NoAuthGuard]
  },
  {
    path: "registration",
    loadComponent: () =>
      import("./registration").then((m) => m.RegistrationPageComponent),
    canLoad: [NoAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
