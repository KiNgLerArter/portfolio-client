import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CarComponent } from "@components/pages/car/car.component";
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
    path: "cars/:model",
    component: CarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: "registration",
    component: RegistrationComponent,
    canActivate: [NoAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
