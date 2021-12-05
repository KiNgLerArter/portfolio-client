import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CarComponent } from '@components/pages/car/car.component';
import { HomeComponent } from '@components/pages/home/home.component';
import { SignInComponent } from '@components/pages/sign-in/sign-in.component';
import { SignUpComponent } from '@components/pages/sign-up/sign-up.component';

import { AuthGuard } from '@guards/auth/auth.guard';
import { NoAuthGuard } from '@guards/no-auth/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cars/:model',
    component: CarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [NoAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
