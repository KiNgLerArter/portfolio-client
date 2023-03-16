import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderModule } from "@layouts/header";
import { PagesModule } from "@pages/pages.module";

import { AuthInterceptor } from "@shared/lib/auth";
import { LoaderModule } from "@shared/lib/loader";

import { AppComponent } from "./ui";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    PagesModule,
    HeaderModule,
    BrowserAnimationsModule,
    LoaderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
