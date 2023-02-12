import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard, NoAuthGuard } from "@shared/lib/auth";
import { HomeComponent } from "./home";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    loadChildren: () => import("./login").then((m) => m.LoginModule),
    canLoad: [NoAuthGuard]
  },
  {
    path: "registration",
    loadChildren: () =>
      import("./registration").then((m) => m.RegistrationModule),
    canLoad: [NoAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
