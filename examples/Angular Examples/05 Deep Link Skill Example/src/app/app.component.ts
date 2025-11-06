import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

// Skill interface
interface Skill {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  moduleCount: number;
  completed: boolean;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [
    trigger("fadeInOut", [
      state("in", style({ opacity: 1 })),
      transition(":enter", [style({ opacity: 0 }), animate("300ms ease-in")]),
      transition(":leave", [animate("300ms ease-out", style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent {
  title = "Financial Skills Training";

  // Replace with your actual authentication token
  authToken = "YOUR_AUTH_TOKEN_HERE";

  // Available skills
  skills: Skill[] = [
    {
      id: "1",
      title: "Choose a Financial Institution",
      description:
        "Learn how to select the right bank or credit union for your needs. Compare features, fees, and services to make an informed decision.",
      estimatedTime: "15 min",
      moduleCount: 3,
      completed: false,
    },
    {
      id: "3",
      title: "Apply for Credit",
      description:
        "Understand the credit application process, improve your chances of approval, and learn how to manage credit responsibly.",
      estimatedTime: "20 min",
      moduleCount: 4,
      completed: false,
    },
  ];

  // UI state
  showZogo = false;
  currentSkillId: string | null = null;

  // Get reference to the Zogo element
  @ViewChild("zogoElement", { static: false }) zogoElement!: ElementRef;

  openZogoSkill(skillId: string): void {
    this.currentSkillId = skillId;
    this.showZogo = true;

    // Wait for view to update before initializing
    setTimeout(() => {
      if (this.zogoElement && this.zogoElement.nativeElement) {
        const zogoEl = this.zogoElement.nativeElement;

        // Initialize with deep link configuration for skill
        zogoEl.initialize({
          user_auth_token: this.authToken,
          widget_type: "deep_link",
          skill_id: skillId, // Note: skill_id instead of module_id
        });

        console.log(`Opening skill ${skillId}`);
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
    if (exitData.source === "end_of_module" && this.currentSkillId) {
      // User completed the entire skill
      this.handleSkillCompletion(this.currentSkillId);
    } else if (
      exitData.source === "back_button" ||
      exitData.source === "exit_button"
    ) {
      // User exited without completing the skill
      console.log("User exited skill early:", this.currentSkillId);
      // Could save partial progress here
    }

    // Reset current skill
    this.currentSkillId = null;
  }

  handleSkillCompletion(skillId: string): void {
    const skill = this.skills.find((s) => s.id === skillId);
    if (skill) {
      skill.completed = true;
      console.log(`Skill ${skillId} marked as complete`);

      // Show completion message
      const skillName = skill.title;
      setTimeout(() => {
        alert(`Congratulations! You completed the "${skillName}" skill!`);
      }, 500);

      // In a real app, save this to backend or localStorage
      // localStorage.setItem(`skill_${skillId}_completed`, 'true');
    }
  }

  getCompletedCount(): number {
    return this.skills.filter((s) => s.completed).length;
  }

  getProgressPercentage(): number {
    return (this.getCompletedCount() / this.skills.length) * 100;
  }

  isSkillCompleted(skillId: string): boolean {
    const skill = this.skills.find((s) => s.id === skillId);
    return skill ? skill.completed : false;
  }
}
