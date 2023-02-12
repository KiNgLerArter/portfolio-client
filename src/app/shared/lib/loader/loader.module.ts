import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "./ui";

const declarationsToExport = [LoaderComponent];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [CommonModule],
  exports: [...declarationsToExport]
})
export class LoaderModule {}
