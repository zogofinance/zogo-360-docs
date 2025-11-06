import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

// Module interface
interface Module {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [
    trigger("slideToggle", [
      state("in", style({ transform: "translateX(0)" })),
      state("out", style({ transform: "translateX(-100%)" })),
      transition("in => out", animate("300ms ease-in")),
      transition("out => in", animate("300ms ease-out")),
    ]),
  ],
})
export class AppComponent {
  title = "Zogo 360 Deep Link Module Example";

  // Replace with your actual authentication token
  authToken = "YOUR_AUTH_TOKEN_HERE";

  // Available modules
  modules: Module[] = [
    {
      id: "994850",
      title: "The Product Life Cycle",
      description:
        "Learn how products evolve from introduction to decline and how to manage each stage effectively.",
      completed: false,
    },
    {
      id: "1008545",
      title: "Investing vs. Savings Goals",
      description:
        "Understand the differences between investing and saving, and how to balance both for your financial future.",
      completed: false,
    },
  ];

  // UI state
  showZogo = false;
  currentModuleId: string | null = null;

  // Get reference to the Zogo element
  @ViewChild("zogoElement", { static: false }) zogoElement!: ElementRef;

  openZogoModule(moduleId: string): void {
    this.currentModuleId = moduleId;
    this.showZogo = true;

    // Wait for view to update before initializing
    setTimeout(() => {
      if (this.zogoElement && this.zogoElement.nativeElement) {
        const zogoEl = this.zogoElement.nativeElement;

        // Initialize with deep link configuration
        zogoEl.initialize({
          user_auth_token: this.authToken,
          widget_type: "deep_link",
          module_id: moduleId,
        });

        console.log(`Opening module ${moduleId}`);
      }
    }, 100);
  }

  onZogoMessage(event: CustomEvent): void {
    console.log("Zogo message:", event.detail.type, event.detail.payload);

    if (event.detail.type === "EXIT_REQUESTED") {
      this.handleZogoExit(event.detail.payload);
    }
  }

  handleZogoExit(exitData: any): void {
    console.log("Exit requested:", exitData);

    // Hide Zogo and show app content
    this.showZogo = false;

    // Handle different exit scenarios
    if (exitData.source === "end_of_module" && this.currentModuleId) {
      // Module was completed
      this.markModuleComplete(this.currentModuleId);
      this.showCompletionMessage();
    } else if (
      exitData.source === "back_button" ||
      exitData.source === "exit_button"
    ) {
      // User exited without completing
      console.log("User exited early from module:", this.currentModuleId);
    }

    // Reset current module
    this.currentModuleId = null;
  }

  markModuleComplete(moduleId: string): void {
    const module = this.modules.find((m) => m.id === moduleId);
    if (module) {
      module.completed = true;
      console.log(`Module ${moduleId} marked as complete`);

      // In a real app, you might save this to a backend or local storage
      // localStorage.setItem(`module_${moduleId}_completed`, 'true');
    }
  }

  showCompletionMessage(): void {
    // Simple alert for demo - in production, use a proper notification system
    setTimeout(() => {
      alert("Congratulations! You completed the module.");
    }, 500);
  }

  getModuleById(id: string): Module | undefined {
    return this.modules.find((m) => m.id === id);
  }

  getCompletedCount(): number {
    return this.modules.filter((m) => m.completed).length;
  }
}
