import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FeaturesModule } from '@components/features/features.module';
import { PagesModule } from '@components/pages/pages.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, FeaturesModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
