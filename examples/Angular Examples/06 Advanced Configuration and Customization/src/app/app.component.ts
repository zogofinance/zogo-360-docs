import { Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { ThemeService, Theme } from "./services/theme.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Zogo 360 Advanced Configuration and Customization";

  // Using a test token from the original example
  authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBsb3ltZW50IjoicHJvZHVjdGlvbiIsInRva2VuX2lkIjo0NjM3Mjg5LCJ0b2tlbl90eXBlIjoiVXNlciIsInVzZXJfaWQiOjExMDYxOTQ4LCJpbnN0aXR1dGlvbl9pZCI6Nzg5NzcsImlhdCI6MTc2MjQwODM3OSwiZXhwIjoxNzYyNDk0Nzc5fQ.ot42O3c9HI1ZO06CkJknpM-nasd1U5JqA30nTNdAFEI";

  // Available themes
  themes: Theme[] = [];
  currentTheme = "default";

  // Status message
  statusMessage: { text: string; type: "success" | "error" } | null = null;

  // Get reference to the Zogo element
  @ViewChild("zogoElement", { static: false }) zogoElement!: ElementRef;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Load available themes
    this.themes = this.themeService.getAllThemes();

    // Subscribe to theme changes
    this.themeService.currentTheme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  applyTheme(themeName: string): void {
    const theme = this.themeService.getTheme(themeName);
    if (theme && this.zogoElement && this.zogoElement.nativeElement) {
      const zogoEl = this.zogoElement.nativeElement;

      // Apply custom CSS
      zogoEl.setCustomCSS(theme.css, null, theme.priority);

      // Update current theme
      this.themeService.setCurrentTheme(themeName);

      console.log(`Applied ${themeName} theme`);
    }
  }

  // Handle Zogo messages
  onZogoMessage(event: CustomEvent): void {
    console.log("Zogo message:", event.detail.type, event.detail.payload);

    switch (event.detail.type) {
      case "CUSTOM_CSS_APPLIED":
        this.showStatus("CSS applied successfully", "success");
        break;
      case "CUSTOM_CSS_ERROR":
        this.showStatus(
          "Failed to apply CSS: " + event.detail.payload.error,
          "error"
        );
        break;
      case "CUSTOM_SOUNDS_LOADED":
        this.showStatus("Sounds loaded successfully", "success");
        break;
      case "CUSTOM_SOUNDS_ERROR":
        this.showStatus(
          "Failed to load sounds: " + event.detail.payload.error,
          "error"
        );
        break;
    }
  }

  // Show status message
  private showStatus(text: string, type: "success" | "error"): void {
    this.statusMessage = { text, type };

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.statusMessage = null;
    }, 3000);
  }

  // Sound customization methods (commented out for reference)
  /*
  setSounds(preset: string): void {
    if (!this.zogoElement || !this.zogoElement.nativeElement) return;
    
    const zogoEl = this.zogoElement.nativeElement;
    const sounds = this.themeService.getCustomSounds(preset);
    
    if (sounds) {
      zogoEl.setCustomSounds(sounds);
      console.log(`Applied ${preset} sound configuration`);
    }
  }
  
  applyCSSFromURL(): void {
    const urlInput = document.getElementById('cssUrl') as HTMLInputElement;
    if (!urlInput || !this.zogoElement || !this.zogoElement.nativeElement) return;
    
    const url = urlInput.value.trim();
    if (url) {
      const zogoEl = this.zogoElement.nativeElement;
      zogoEl.setCustomCSS(null, url, 'url');
      console.log(`Applied CSS from URL: ${url}`);
    }
  }
  */

  // Check if a theme is currently active
  isThemeActive(themeName: string): boolean {
    return this.currentTheme === themeName;
  }
}
