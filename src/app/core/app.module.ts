import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { PagesModule } from "@pages/pages.module";
import { AppComponent } from "./ui";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HeaderModule } from "@layouts/header";
import { AuthInterceptor } from "@shared/lib/auth";
import { LoaderModule } from "@shared/lib/loader";

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
