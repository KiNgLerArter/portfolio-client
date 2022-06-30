import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeModule } from "./home/home.module";
import { LoginModule } from "./login/login.module";
import { RegistrationModule } from "./registration/registration.module";
import { PagesRoutingModule } from "./pages-routing.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule,
    HomeModule,
    LoginModule,
    RegistrationModule
  ],
  exports: [PagesRoutingModule]
})
export class PagesModule {}
