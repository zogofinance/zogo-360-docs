# Deep Link Skill Example

This example demonstrates how to use Zogo 360's deep linking feature to open complete skills (collections of modules) rather than individual modules, allowing users to complete an entire learning path.

## What This Example Shows

- How to use `skill_id` instead of `module_id` for deep linking
- How to handle skill completion vs module completion
- How to track progress across multiple modules within a skill
- How to create a skill selection interface

## Requirements

- A valid Zogo 360 authentication token
- Valid skill IDs (this example uses real skill IDs)
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Deep Link Widget Type**: Opens a specific skill path
- **Skill ID Parameter**: Directs users to a complete skill with multiple modules
- **Exit Event Handling**: Manages return flow after skill completion
- **Progress Tracking**: Updates UI based on skill completion

## Difference Between Skills and Modules

### Modules

- Single learning units (e.g., "The Product Life Cycle")
- Typically 5-10 minutes to complete
- Cover one specific topic
- Award points upon completion

### Skills

- Collections of related modules
- Complete learning paths on a broader topic
- May include 3-10 modules
- Award badges or certificates upon full completion
- Allow users to progress through multiple lessons in sequence

## Example Skill IDs

This example includes two real Zogo skills:

1. **Skill ID: 1** - "Choose a Financial Institution"

   - Covers how to evaluate banks and credit unions
   - Includes modules on account types, fees, and services
   - Helps users make informed banking decisions

2. **Skill ID: 3** - "Apply for Credit"
   - Teaches the credit application process
   - Covers credit scores, application tips, and approval factors
   - Prepares users for responsible credit use

## How Skill Deep Linking Works

When you initialize with a `skill_id`:

1. Zogo opens to the skill's introduction or first module
2. Users progress through all modules in the skill
3. Navigation between modules is handled within Zogo
4. An `EXIT_REQUESTED` event fires when users complete all modules or exit early

## Configuration Difference

For skills, use `skill_id` instead of `module_id`:

```javascript
// For a single module
zogoElement.initialize({
  user_auth_token: "TOKEN",
  widget_type: "deep_link",
  module_id: "994850", // Single module
});

// For a complete skill
zogoElement.initialize({
  user_auth_token: "TOKEN",
  widget_type: "deep_link",
  skill_id: "1", // Complete skill path
});
```

## Exit Handling for Skills

Skills require more sophisticated exit handling because users might:

- Complete the entire skill (all modules)
- Exit after completing some modules
- Exit without completing any modules

### Tracking Partial Progress

```javascript
function handleZogoExit(exitData) {
  if (exitData.source === "end_of_module") {
    // Full skill completed
    markSkillComplete(currentSkillId);
  } else {
    // Partial completion - check context
    if (exitData.context && exitData.context.modulesCompleted) {
      savePartialProgress(currentSkillId, exitData.context.modulesCompleted);
    }
  }
}
```

## Implementation Patterns

### 1. Skill Catalog with Progress

```javascript
const skills = [
  {
    id: "1",
    name: "Choose a Financial Institution",
    modules: 5,
    estimatedTime: "25 minutes",
    difficulty: "Beginner",
  },
  {
    id: "3",
    name: "Apply for Credit",
    modules: 7,
    estimatedTime: "35 minutes",
    difficulty: "Intermediate",
  },
];

function renderSkillCatalog() {
  skills.forEach((skill) => {
    const progress = getUserSkillProgress(skill.id);
    const card = createSkillCard(skill, progress);
    catalog.appendChild(card);
  });
}
```

### 2. Learning Path Integration

```javascript
const learningPaths = {
  "financial-basics": {
    name: "Financial Fundamentals",
    skills: ["1", "3", "5", "7"],
    requiredForCompletion: 3,
  },
};

function checkLearningPathProgress(pathId) {
  const path = learningPaths[pathId];
  const completedSkills = path.skills.filter((skillId) =>
    isSkillCompleted(skillId)
  );

  return {
    completed: completedSkills.length,
    total: path.skills.length,
    percentage: (completedSkills.length / path.skills.length) * 100,
  };
}
```

### 3. Prerequisite System

```javascript
const skillPrerequisites = {
  3: ["1"], // Must complete skill 1 before skill 3
  7: ["3", "5"], // Must complete skills 3 and 5 before skill 7
};

function canAccessSkill(skillId) {
  const prerequisites = skillPrerequisites[skillId] || [];
  return prerequisites.every((prereqId) => isSkillCompleted(prereqId));
}

function openZogoSkill(skillId) {
  if (!canAccessSkill(skillId)) {
    alert("Please complete prerequisite skills first!");
    return;
  }

  // Proceed with opening the skill
  zogoElement.initialize({
    user_auth_token: token,
    widget_type: "deep_link",
    skill_id: skillId,
  });
}
```

### 4. Gamification and Rewards

```javascript
const skillRewards = {
  1: { points: 500, badge: "banking-basics" },
  3: { points: 750, badge: "credit-smart" },
};

function handleSkillCompletion(skillId) {
  const reward = skillRewards[skillId];

  // Award points
  addUserPoints(reward.points);

  // Award badge
  unlockBadge(reward.badge);

  // Check for milestone achievements
  checkMilestones({
    totalSkillsCompleted: getUserCompletedSkillsCount(),
    category: getSkillCategory(skillId),
  });

  // Show celebration
  showCompletionAnimation(reward);
}
```

## Best Practices for Skill Integration

### 1. Show Skill Overview

Before starting, show users what they'll learn:

```javascript
function showSkillPreview(skillId) {
  const skillInfo = getSkillInfo(skillId);

  const preview = `
        <h3>${skillInfo.name}</h3>
        <p>${skillInfo.description}</p>
        <ul>
            <li>Modules: ${skillInfo.moduleCount}</li>
            <li>Time: ${skillInfo.estimatedTime}</li>
            <li>Points: ${skillInfo.totalPoints}</li>
        </ul>
        <h4>You'll learn:</h4>
        <ul>
            ${skillInfo.learningObjectives
              .map((obj) => `<li>${obj}</li>`)
              .join("")}
        </ul>
    `;

  showModal(preview, {
    confirmText: "Start Skill",
    onConfirm: () => openZogoSkill(skillId),
  });
}
```

### 2. Resume Functionality

Allow users to resume incomplete skills:

```javascript
function getSkillProgress(skillId) {
  return {
    started: localStorage.getItem(`skill_${skillId}_started`),
    modulesCompleted: JSON.parse(
      localStorage.getItem(`skill_${skillId}_modules`) || "[]"
    ),
    lastAccessed: localStorage.getItem(`skill_${skillId}_last_accessed`),
  };
}

function renderSkillButton(skill) {
  const progress = getSkillProgress(skill.id);

  if (
    progress.modulesCompleted.length > 0 &&
    progress.modulesCompleted.length < skill.totalModules
  ) {
    return `
            <button onclick="openZogoSkill('${skill.id}')">
                Resume (${progress.modulesCompleted.length}/${skill.totalModules})
            </button>
        `;
  }

  return `<button onclick="openZogoSkill('${skill.id}')">Start</button>`;
}
```

### 3. Time Estimates

Help users plan their learning:

```javascript
function estimateSkillTime(skillId) {
  const baseTime = getSkillBaseTime(skillId);
  const userPace = getUserAveragePace(); // Based on previous completions

  return {
    minimum: baseTime * 0.8,
    average: baseTime,
    maximum: baseTime * 1.5,
    personalized: baseTime * userPace,
  };
}
```

## Common Use Cases

### Corporate Training

- Assign skills to employees based on role
- Track completion for compliance
- Generate reports on skill proficiency
- Create custom learning paths per department

### Educational Platforms

- Structure curriculum around skill paths
- Award certificates for skill completion
- Track student progress across skills
- Implement prerequisite requirements

### Financial Wellness Programs

- Guide users through financial literacy journey
- Unlock financial products after skill completion
- Provide personalized skill recommendations
- Track improvement in financial behaviors

## Analytics Considerations

Track comprehensive skill analytics:

```javascript
// Skill started
analytics.track("skill_started", {
  skillId: skillId,
  skillName: getSkillName(skillId),
  totalModules: getSkillModuleCount(skillId),
  estimatedTime: getSkillEstimatedTime(skillId),
  userLevel: getUserLevel(),
});

// Skill completed
analytics.track("skill_completed", {
  skillId: skillId,
  completionTime: calculateCompletionTime(),
  modulesCompleted: exitData.context.modulesCompleted,
  pointsEarned: getSkillPoints(skillId),
  badgeEarned: getSkillBadge(skillId),
});

// Skill abandoned
analytics.track("skill_abandoned", {
  skillId: skillId,
  modulesCompleted: exitData.context.modulesCompleted || 0,
  percentComplete: calculatePercentComplete(),
  timeSpent: calculateTimeSpent(),
  exitPoint: exitData.context.currentModule,
});
```

## Error Handling

Handle skill-specific errors:

```javascript
zogoElement.addEventListener("message", function (event) {
  if (event.detail.type === "INITIALIZATION_ERROR") {
    const error = event.detail.payload.error;

    if (error.includes("skill not found")) {
      showError("This skill is no longer available.");
    } else if (error.includes("access denied")) {
      showError("You don't have access to this skill yet.");
      suggestPrerequisites(currentSkillId);
    } else {
      showError("Unable to load skill. Please try again.");
    }

    returnToSkillCatalog();
  }
});
```

## Testing Checklist

- [ ] Test with valid skill IDs
- [ ] Test with invalid skill IDs
- [ ] Test completing entire skill
- [ ] Test exiting after partial completion
- [ ] Test exiting immediately
- [ ] Test resuming incomplete skills
- [ ] Test skill prerequisites
- [ ] Test reward distribution
- [ ] Test progress tracking
- [ ] Test error scenarios
