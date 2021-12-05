import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { CarComponent } from './car/car.component';



@NgModule({
  declarations: [
    HomeComponent,
    SignUpComponent,
    SignInComponent,
    CarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }
