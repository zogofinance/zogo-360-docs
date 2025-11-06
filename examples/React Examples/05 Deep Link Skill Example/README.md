# Deep Link Skill Example - React

This example demonstrates how to deep link directly to specific Zogo 360 skills from within a React application, allowing users to jump straight into targeted skill-building exercises.

## What This Example Shows

- How to initialize Zogo 360 with skill-specific deep links in React
- How to track skill completion status
- How to build a progress tracking UI
- How to handle exit events for completed and incomplete skills

## Requirements

- Node.js and npm installed
- A valid Zogo 360 authentication token
- Valid skill IDs from your Zogo 360 content library
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Deep linking**: Using `widget_type: "deep_link"` with `skill_id`
- **Progress tracking**: Maintaining completion state across skills
- **Visual feedback**: Showing completed skills with different styling
- **Progress visualization**: Progress bar showing overall completion

## How to Use

1. Clone or download this example
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Replace `YOUR_AUTH_TOKEN_HERE` in `src/App.js` with your actual authentication token
5. Optionally, update the skill IDs in the `skills` array with your own content
6. Start the development server:
   ```bash
   npm start
   ```
7. Open your browser to `http://localhost:3000`
8. Click on any skill to start learning

## Deep Link Configuration for Skills

The key difference for skills is using `skill_id` instead of `module_id`:

```javascript
zogoElement.initialize({
  user_auth_token: "YOUR_AUTH_TOKEN_HERE",
  widget_type: "deep_link",
  skill_id: skillId,
});
```

## Project Structure

```
├── public/
│   └── index.html          # HTML template with Zogo 360 script
├── src/
│   ├── App.js             # Main React component with skill management
│   ├── App.css            # Component styles with skill cards and progress
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

## Key Implementation Details

### Skill Data Structure

```jsx
const skills = [
  {
    id: "1",
    name: "Choose a Financial Institution",
    description: "Learn how to select the right bank or credit union...",
    icon: "🏦",
  },
  {
    id: "3",
    name: "Apply for Credit",
    description: "Understand the credit application process...",
    icon: "💳",
  },
];
```

### Progress Tracking

The app uses React state to track completed skills:

```jsx
const [completedSkills, setCompletedSkills] = useState(new Set());

// When a skill is completed
setCompletedSkills((prev) => new Set([...prev, skillId]));
```

### Visual Progress Indicator

```jsx
<div className="progress-bar">
  <div
    className="progress-fill"
    style={{ width: `${(completedSkills.size / skills.length) * 100}%` }}
  />
</div>
```

## Skills vs Modules

### Skills

- Typically shorter, focused learning experiences
- Often part of a larger learning path
- May include interactive exercises or assessments
- Usually have specific learning objectives

### Modules

- Can be longer, more comprehensive content
- May contain multiple lessons or topics
- Often standalone learning experiences
- Can include various types of content

## Use Cases

### Onboarding Flow

Guide new users through essential skills:

```jsx
const onboardingSkills = [
  { id: "1", name: "Account Setup", required: true },
  { id: "2", name: "Security Basics", required: true },
  { id: "3", name: "First Transaction", required: false },
];
```

### Skill-Based Achievements

Unlock features based on completed skills:

```jsx
const checkFeatureAccess = () => {
  if (completedSkills.has("credit_basics")) {
    enableCreditCardApplication();
  }
  if (completedSkills.has("investment_101")) {
    enableInvestmentPortfolio();
  }
};
```

### Learning Paths

Create sequential skill progressions:

```jsx
const learningPaths = {
  beginner: ["1", "2", "3"],
  intermediate: ["4", "5", "6"],
  advanced: ["7", "8", "9"],
};

const getNextSkill = (currentPath, completedSkills) => {
  const path = learningPaths[currentPath];
  return path.find((skillId) => !completedSkills.has(skillId));
};
```

## Best Practices

1. **Persist Progress**: Save completed skills to localStorage or your backend
2. **Show Prerequisites**: Indicate if skills have prerequisites
3. **Provide Incentives**: Offer rewards or badges for skill completion
4. **Track Time**: Monitor how long users spend on each skill
5. **Offer Retakes**: Allow users to revisit completed skills

## Progress Persistence Example

```jsx
// Save progress
useEffect(() => {
  localStorage.setItem("completedSkills", JSON.stringify([...completedSkills]));
}, [completedSkills]);

// Load progress
useEffect(() => {
  const saved = localStorage.getItem("completedSkills");
  if (saved) {
    setCompletedSkills(new Set(JSON.parse(saved)));
  }
}, []);
```

## Skill ID Management

To get valid skill IDs:

1. Contact your Zogo 360 account manager
2. Use the Zogo 360 admin dashboard
3. Check your skills library documentation

## Notes

- Skill IDs are specific to your organization's content library
- Skills may have different completion criteria than modules
- Consider implementing a skill recommendation engine
- Track skill completion analytics for insights
- Skills can be grouped into categories or learning paths
