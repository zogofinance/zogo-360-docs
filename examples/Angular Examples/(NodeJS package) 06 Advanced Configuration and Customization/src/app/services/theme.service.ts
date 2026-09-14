import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface Theme {
  name: string;
  displayName: string;
  css: string;
  priority: "inline" | "url";
}

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private themes: Map<string, Theme> = new Map();
  private currentThemeSubject = new BehaviorSubject<string>("default");

  currentTheme$: Observable<string> = this.currentThemeSubject.asObservable();

  constructor() {
    this.initializeThemes();
  }

  private initializeThemes(): void {
    // Default theme (no custom CSS)
    this.themes.set("default", {
      name: "default",
      displayName: "Default",
      css: "",
      priority: "inline",
    });

    // Light theme
    this.themes.set("light", {
      name: "light",
      displayName: "Light Mode",
      css: `
        :root {
          /* Light mode color scheme */
          --brand-primary: #1c64f2;
          --tints-primary-1: #ebf5ff;
          --tints-primary-2: #c3ddfd;
          --tints-primary-3: #76a9fa;
          --shades-primary-1: #233876;
          --shades-primary-2: #1a223a;

          --brand-green: #04cd92;
          --tints-green-1: #e9faf5;
          --shades-green-1: #148060;

          --brand-gold: #faca15;
          --tints-gold-1: #fefae8;
          --shades-gold-1: #886e0c;

          --brand-orange: #ff5a1f;
          --tints-orange-1: #fff3ee;
          --shades-orange-1: #bf4417;

          --utility-red: #ed3731;
          --utility-red-tint-1: #fef0ef;
          --utility-red-shade-1: #c51711;

          --neutral-white: #ffffff;
          --neutral-100: #f6f6f6;
          --neutral-200: #ececec;
          --neutral-300: #dcdcdc;
          --neutral-400: #acacac;
          --neutral-500: #8c8c8c;
          --neutral-600: #6f6f6f;
          --neutral-700: #484848;
          --neutral-800: #313131;
          --neutral-warm-100: #faf9f5;
          --neutral-warm-200: #f5f3eb;
          --neutral-warm-300: #eeebdd;
        }
        
        body {
          background-color: var(--neutral-white) !important;
          color: var(--neutral-800) !important;
        }
      `,
      priority: "inline",
    });

    // Dark theme
    this.themes.set("dark", {
      name: "dark",
      displayName: "Dark Mode",
      css: `
        :root {
          /* Dark mode color scheme */
          --brand-primary: #76a9fa;
          --tints-primary-1: #1a223a;
          --tints-primary-2: #233876;
          --tints-primary-3: #1c64f2;
          --shades-primary-1: #c3ddfd;
          --shades-primary-2: #ebf5ff;

          --brand-green: #04cd92;
          --tints-green-1: #148060;
          --shades-green-1: #e9faf5;

          --brand-gold: #faca15;
          --tints-gold-1: #886e0c;
          --shades-gold-1: #fefae8;

          --brand-orange: #ff5a1f;
          --tints-orange-1: #bf4417;
          --shades-orange-1: #fff3ee;

          --utility-red: #ed3731;
          --utility-red-tint-1: #c51711;
          --utility-red-shade-1: #fef0ef;

          --neutral-white: #1a1a1a;
          --neutral-100: #242424;
          --neutral-200: #2d2d2d;
          --neutral-300: #3a3a3a;
          --neutral-400: #6f6f6f;
          --neutral-500: #8c8c8c;
          --neutral-600: #acacac;
          --neutral-700: #dcdcdc;
          --neutral-800: #f6f6f6;
          --neutral-warm-100: #2a2925;
          --neutral-warm-200: #353329;
          --neutral-warm-300: #42402d;
        }
        
        body {
          background-color: var(--neutral-white) !important;
          color: var(--neutral-800) !important;
        }
        
        .card, .module-card {
          background-color: var(--neutral-200) !important;
          border-color: var(--neutral-300) !important;
          color: var(--neutral-800) !important;
        }
        
        .btn-primary {
          background-color: var(--brand-primary) !important;
          border-color: var(--brand-primary) !important;
          color: var(--neutral-white) !important;
        }
        
        .text-muted {
          color: var(--neutral-600) !important;
        }
        
        /* Additional dark mode adjustments */
        .navbar {
          background-color: var(--neutral-100) !important;
          border-bottom: 1px solid var(--neutral-300) !important;
        }
        
        input, select, textarea {
          background-color: var(--neutral-100) !important;
          border-color: var(--neutral-300) !important;
          color: var(--neutral-800) !important;
        }
        
        .modal-content {
          background-color: var(--neutral-200) !important;
          color: var(--neutral-800) !important;
        }
      `,
      priority: "inline",
    });
  }

  getTheme(name: string): Theme | undefined {
    return this.themes.get(name);
  }

  getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  getCurrentTheme(): string {
    return this.currentThemeSubject.value;
  }

  setCurrentTheme(themeName: string): void {
    if (this.themes.has(themeName)) {
      this.currentThemeSubject.next(themeName);
    }
  }

  // Example method for custom sound configuration (commented out)
  /*
  getCustomSounds(preset: string): any[] {
    const soundPresets: { [key: string]: any[] } = {
      muted: [
        { name: "achievement", url: "" },
        { name: "notification", url: "" },
        { name: "error", url: "" },
        { name: "success", url: "" }
      ],
      custom: [
        { name: "achievement", url: "https://yourdomain.com/sounds/custom-achievement.mp3" },
        { name: "notification", url: "https://yourdomain.com/sounds/custom-notification.mp3" }
      ]
    };
    
    return soundPresets[preset] || [];
  }
  */
}
