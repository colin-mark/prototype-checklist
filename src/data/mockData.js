// Mock data for the checklist builder prototype

export const userData = {
  name: "{name}",
  avatar: "👋"
};

export const taskGroups = [
  {
    id: "project-setup",
    title: "Project Setup",
    tasks: [
      {
        id: "define-objectives",
        name: "Define Project Objectives",
        dueDate: "07/01/24",
        assignee: { name: "Alex", avatar: "👤" },
        comments: 6,
        status: "completed",
        completed: true
      },
      {
        id: "gather-requirements",
        name: "Gather Requirements",
        dueDate: "07/07/24",
        assignee: { name: "Sarah", avatar: "👤" },
        comments: 6,
        status: "completed",
        completed: true
      },
      {
        id: "stakeholder-approval",
        name: "Get Stakeholder Approval",
        dueDate: "07/07/24",
        assignee: { name: "Jordan", avatar: "👤" },
        comments: 2,
        status: "not-started",
        completed: false,
        isOverdue: true
      },
      {
        id: "create-timeline",
        name: "Create Project Timeline",
        dueDate: "07/14/24",
        assignee: { name: "Alex", avatar: "👤" },
        comments: 0,
        status: "in-progress",
        completed: false
      },
      {
        id: "allocate-resources",
        name: "Allocate Resources",
        dueDate: "07/14/24",
        assignee: { name: "Taylor", avatar: "👤" },
        comments: 0,
        status: "not-started",
        completed: false
      }
    ]
  },
  {
    id: "planning",
    title: "Planning & Design",
    tasks: [
      {
        id: "research-phase",
        name: "Complete Research Phase",
        dueDate: "07/01/24",
        assignee: { name: "Morgan", avatar: "👤" },
        comments: 3,
        status: "completed",
        completed: true
      },
      {
        id: "create-wireframes",
        name: "Create Wireframes",
        dueDate: "07/14/24",
        assignee: { name: "Team", avatar: "👥" },
        comments: 0,
        status: "completed",
        completed: true
      },
      {
        id: "design-mockups",
        name: "Design Mockups",
        dueDate: "07/14/24",
        assignee: { name: "Casey", avatar: "👤" },
        comments: 2,
        status: "completed",
        completed: true
      },
      {
        id: "user-testing",
        name: "Conduct User Testing",
        dueDate: "07/26/24",
        assignee: { name: "Team", avatar: "👥" },
        comments: 0,
        status: "not-started",
        completed: false
      }
    ]
  },
  {
    id: "implementation",
    title: "Implementation & Testing",
    tasks: [
      {
        id: "setup-environment",
        name: "Setup Development Environment",
        dueDate: "07/01/24",
        assignee: { name: "Riley", avatar: "👤" },
        comments: 3,
        status: "completed",
        completed: true
      },
      {
        id: "build-core-features",
        name: "Build Core Features",
        dueDate: "07/14/24",
        assignee: { name: "Team", avatar: "👥" },
        comments: 0,
        status: "completed",
        completed: true
      },
      {
        id: "quality-assurance",
        name: "Quality Assurance Testing",
        dueDate: "07/14/24",
        assignee: { name: "Sam", avatar: "👤" },
        comments: 2,
        status: "completed",
        completed: true
      },
      {
        id: "performance-testing",
        name: "Performance Testing",
        dueDate: "07/26/24",
        assignee: { name: "Team", avatar: "👥" },
        comments: 0,
        status: "not-started",
        completed: false
      },
      {
        id: "security-review",
        name: "Security Review",
        dueDate: "07/14/24",
        assignee: { name: "Jamie", avatar: "👤" },
        comments: 0,
        status: "not-started",
        completed: false
      },
      {
        id: "final-approval",
        name: "Get Final Approval",
        dueDate: "07/26/24",
        assignee: { name: "Team", avatar: "👥" },
        comments: 0,
        status: "not-started",
        completed: false
      },
      {
        id: "documentation",
        name: "Complete Documentation",
        dueDate: "07/14/24",
        assignee: { name: "Pat", avatar: "👤" },
        comments: 0,
        status: "not-started",
        completed: false
      },
      {
        id: "training-materials",
        name: "Create Training Materials",
        dueDate: "07/26/24",
        assignee: { name: "Team", avatar: "👥" },
        comments: 0,
        status: "not-started",
        completed: false
      },
      {
        id: "backup-strategy",
        name: "Implement Backup Strategy",
        dueDate: "07/14/24",
        assignee: { name: "Avery", avatar: "👤" },
        comments: 0,
        status: "not-started",
        completed: false
      }
    ]
  },
  {
    id: "deployment",
    title: "Deployment",
    tasks: []
  },
  {
    id: "launch",
    title: "Launch & Go-Live",
    tasks: []
  },
  {
    id: "post-launch",
    title: "Post-Launch Support",
    tasks: []
  }
];

export const tabs = [
  { id: "onboarding", label: "Onboarding Tasks", active: true },
  { id: "comments", label: "Comments/Notifications", active: false }
];
