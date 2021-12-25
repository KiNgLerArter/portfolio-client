import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CarComponent } from './car/car.component';
import { FeaturesModule } from '@components/features/features.module';

@NgModule({
  declarations: [HomeComponent, SignInComponent, SignUpComponent, CarComponent],
  imports: [CommonModule, FeaturesModule],
})
export class PagesModule {}
