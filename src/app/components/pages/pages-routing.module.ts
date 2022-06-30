import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "@components/pages/home/home.component";
import { LoginComponent } from "@components/pages/login/login.component";
import { RegistrationComponent } from "@components/pages/registration/registration.component";

import { AuthGuard } from "@guards/auth/auth.guard";
import { NoAuthGuard } from "@guards/no-auth/no-auth.guard";

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
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
    canLoad: [NoAuthGuard]
  },
  {
    path: "registration",
    loadChildren: () =>
      import("./registration/registration.module").then(
        (m) => m.RegistrationModule
      ),
    canLoad: [NoAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
