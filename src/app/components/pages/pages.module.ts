import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CarModule } from "./car/car.module";
import { HomeModule } from "./home/home.module";
import { LoginModule } from "./login/login.module";
import { RegistrationModule } from "./registration/registration.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CarModule,
    HomeModule,
    LoginModule,
    RegistrationModule
  ]
})
export class PagesModule {}
