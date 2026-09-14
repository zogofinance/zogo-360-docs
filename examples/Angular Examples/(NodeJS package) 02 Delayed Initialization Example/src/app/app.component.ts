import { Component, ElementRef, ViewChild } from "@angular/core";

// Declare the Zogo element type
declare global {
  interface HTMLElementTagNameMap {
    "zogo-360": any;
  }
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Zogo 360 Delayed Initialization Example";

  // Replace with your actual authentication token
  authToken = "YOUR_AUTH_TOKEN_HERE";

  // Track initialization state
  isInitialized = false;

  // Get reference to the Zogo element
  @ViewChild("zogoContainer", { static: false }) zogoContainer!: ElementRef;

  initializeZogo(): void {
    if (this.zogoContainer && this.zogoContainer.nativeElement) {
      const zogoElement = this.zogoContainer.nativeElement;

      // Initialize with configuration
      zogoElement.initialize({
        user_auth_token: this.authToken,
      });

      // Update state
      this.isInitialized = true;

      console.log("Zogo 360 initialized");
    }
  }
}
