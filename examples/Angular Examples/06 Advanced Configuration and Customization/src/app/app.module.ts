import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";

import { AppComponent } from "./app.component";
import { ThemeService } from "./services/theme.service";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CommonModule],
  providers: [ThemeService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Required for custom elements like <zogo-360>
})
export class AppModule {}
