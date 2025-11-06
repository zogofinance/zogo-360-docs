import { Component } from "@angular/core";

// Define event log entry interface
interface EventLogEntry {
  timestamp: Date;
  type: string;
  data: any;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Zogo 360 Event Listeners Example";

  // Replace with your actual authentication token
  authToken = "YOUR_AUTH_TOKEN_HERE";

  // Event log array
  eventLog: EventLogEntry[] = [];

  // Maximum number of events to keep in log
  maxLogEntries = 100;

  // Handle Zogo initialization event
  onZogoInitialized(event: CustomEvent): void {
    this.addEventToLog("zogo360:initialized", event.detail);
  }

  // Handle general messages from Zogo
  onZogoMessage(event: CustomEvent): void {
    this.addEventToLog(`message:${event.detail.type}`, event.detail.payload);
  }

  // Handle URL open requests
  onOpenUrl(event: CustomEvent): void {
    this.addEventToLog("openurl", event.detail);

    // Log the URL but don't automatically open it
    console.log("URL requested:", event.detail.url);

    // Uncomment the following line to automatically open URLs
    // window.open(event.detail.url, '_blank');
  }

  // Handle sound play requests
  onPlaySound(event: CustomEvent): void {
    this.addEventToLog("playsound", event.detail);
  }

  // Add event to log with timestamp
  private addEventToLog(type: string, data: any): void {
    const entry: EventLogEntry = {
      timestamp: new Date(),
      type: type,
      data: data,
    };

    // Add to beginning of array
    this.eventLog.unshift(entry);

    // Keep log size manageable
    if (this.eventLog.length > this.maxLogEntries) {
      this.eventLog.pop();
    }

    // Also log to console for debugging
    console.log(`[${type}]`, data);
  }

  // Format timestamp for display
  formatTimestamp(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  }

  // Format event data for display
  formatEventData(data: any): string {
    if (data === null || data === undefined) {
      return "null";
    }
    if (typeof data === "string") {
      return data;
    }
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  }

  // Clear the event log
  clearLog(): void {
    this.eventLog = [];
  }
}
