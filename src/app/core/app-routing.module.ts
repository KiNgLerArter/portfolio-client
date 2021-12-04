import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { NoAuthGuard } from './guards/no-auth/no-auth.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   component: HomeComponent,
  //   canActivate: AuthGuard,
  // },
  // {
  //   path: 'cars/:model',
  //   component: CarComponent,
  //   canActivate: AuthGuard,
  // },
  // {
  //   path: 'sign-up',
  //   component: SignUpComponent,
  //   canActivate: NoAuthGuard
  // },
  // {
  //   path: 'sign-in',
  //   component: SignInComponent,
  //   canActivate: NoAuthGuard
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
