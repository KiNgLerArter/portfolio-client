import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { PagesRoutingModule } from "./pages-routing.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, PagesRoutingModule],
  exports: [PagesRoutingModule]
})
export class PagesModule {}
