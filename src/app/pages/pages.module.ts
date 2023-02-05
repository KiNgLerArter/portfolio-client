import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagesRoutingModule } from "./pages-routing.module";
import { HomeModule } from "./home";
import { LoginModule } from "./login";
import { RegistrationModule } from "./registration";

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
