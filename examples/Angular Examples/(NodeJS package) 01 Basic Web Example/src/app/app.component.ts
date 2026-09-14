import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Zogo 360 Basic Angular Example";

  // Replace with your actual authentication token
  authToken = "YOUR_AUTH_TOKEN_HERE";
}
