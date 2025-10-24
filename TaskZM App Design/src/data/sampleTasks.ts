import imgEllipse1 from "figma:asset/d27a4024b461a05be4dc5d2794f44523e1a6d307.png";
import imgEllipse2 from "figma:asset/0b09f1f030532c052b907665b73802b76fc8d1f2.png";

interface Task {
  id: string;
  title: string;
  description: string;
  tags: Array<{
    text: string;
    bgColor: string;
    textColor: string;
    fontWeight: "bold" | "medium";
  }>;
  priority: "high" | "medium" | "low";
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  links?: { text: string; url: string }[];
  files?: { name: string; icon: string }[];
  notes?: string;
  status: "todo" | "inprogress" | "done";
  scheduledDate: string; // Format: YYYY-MM-DD
  scheduledTime?: string; // Format: HH:MM
  subtasks?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

export const sampleTasks: Task[] = [
  // October 1, 2025 (Wednesday) - Today
  {
    id: "1",
    title: "Morning Team Standup",
    description:
      "Daily sync with the development team to discuss progress and blockers",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
      {
        text: "Meeting",
        bgColor: "#e0e7ff",
        textColor: "#3730a3",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "1 Oct",
    status: "inprogress",
    scheduledDate: "2025-10-01",
    scheduledTime: "09:00",
  },
  {
    id: "2",
    title: "Review Q4 Budget",
    description:
      "Analyze spending and prepare budget report for stakeholders",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Mike Chen",
      avatar: imgEllipse1,
    },
    dueDate: "1 Oct",
    status: "todo",
    scheduledDate: "2025-10-01",
    scheduledTime: "10:30",
    subtasks: [
      {
        id: "subtask-1",
        text: "Gather expense reports from all departments",
        completed: true,
      },
      {
        id: "subtask-2",
        text: "Analyze spending trends vs. budget allocations",
        completed: false,
      },
      {
        id: "subtask-3",
        text: "Identify areas of overspending",
        completed: false,
      },
      {
        id: "subtask-4",
        text: "Prepare PowerPoint presentation for stakeholders",
        completed: false,
      },
      {
        id: "subtask-5",
        text: "Schedule meeting with finance team",
        completed: false,
      },
    ],
  },
  {
    id: "3",
    title: "Dentist Appointment",
    description: "Regular dental checkup and cleaning",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "You",
      avatar: imgEllipse2,
    },
    dueDate: "1 Oct",
    status: "todo",
    scheduledDate: "2025-10-01",
    scheduledTime: "14:00",
  },
  {
    id: "4",
    title: "Update Project Documentation",
    description: "Document API changes and update README files",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Alex Rivera",
      avatar: imgEllipse2,
    },
    dueDate: "1 Oct",
    status: "todo",
    scheduledDate: "2025-10-01",
    scheduledTime: "16:00",
    subtasks: [
      {
        id: "subtask-6",
        text: "Review recent API changes",
        completed: false,
      },
      {
        id: "subtask-7",
        text: "Update API documentation",
        completed: false,
      },
      {
        id: "subtask-8",
        text: "Update README with new setup instructions",
        completed: false,
      },
      {
        id: "subtask-9",
        text: "Create migration guide for breaking changes",
        completed: false,
      },
    ],
  },

  // October 2, 2025 (Thursday)
  {
    id: "5",
    title: "Client Presentation Prep",
    description: "Finalize slides for tomorrow's client demo",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Jane Smith",
      avatar: imgEllipse2,
    },
    dueDate: "2 Oct",
    files: [{ name: "Presentation.pptx", icon: "file" }],
    status: "todo",
    scheduledDate: "2025-10-02",
    scheduledTime: "09:00",
  },
  {
    id: "6",
    title: "Code Review - Auth Module",
    description: "Review authentication module pull request",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "David Kim",
      avatar: imgEllipse2,
    },
    dueDate: "2 Oct",
    links: [{ text: "Pull Request #245", url: "#" }],
    status: "todo",
    scheduledDate: "2025-10-02",
    scheduledTime: "11:00",
  },
  {
    id: "7",
    title: "Grocery Shopping",
    description:
      "Weekly grocery run - get essentials for the week",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse1,
    },
    dueDate: "2 Oct",
    status: "todo",
    scheduledDate: "2025-10-02",
    scheduledTime: "18:00",
  },

  // October 3, 2025 (Friday)
  {
    id: "8",
    title: "Client Demo Meeting",
    description: "Present new features to stakeholders",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "3 Oct",
    status: "todo",
    scheduledDate: "2025-10-03",
    scheduledTime: "10:00",
  },
  {
    id: "9",
    title: "Deploy Staging Environment",
    description: "Push latest changes to staging for testing",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Alex Rivera",
      avatar: imgEllipse2,
    },
    dueDate: "3 Oct",
    status: "todo",
    scheduledDate: "2025-10-03",
    scheduledTime: "14:00",
  },
  {
    id: "10",
    title: "Team Happy Hour",
    description: "Casual team gathering at local pub",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse1,
    },
    dueDate: "3 Oct",
    status: "todo",
    scheduledDate: "2025-10-03",
    scheduledTime: "17:30",
  },

  // October 4, 2025 (Saturday)
  {
    id: "11",
    title: "Morning Workout",
    description: "Gym session - upper body day",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "You",
      avatar: imgEllipse2,
    },
    dueDate: "4 Oct",
    status: "todo",
    scheduledDate: "2025-10-04",
    scheduledTime: "08:00",
  },
  {
    id: "12",
    title: "Home Office Setup",
    description: "Organize desk and upgrade monitor setup",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse1,
    },
    dueDate: "4 Oct",
    status: "todo",
    scheduledDate: "2025-10-04",
    scheduledTime: "11:00",
  },

  // October 5, 2025 (Sunday)
  {
    id: "13",
    title: "Meal Prep Sunday",
    description: "Prepare meals for the upcoming week",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "You",
      avatar: imgEllipse2,
    },
    dueDate: "5 Oct",
    status: "todo",
    scheduledDate: "2025-10-05",
    scheduledTime: "14:00",
  },
  {
    id: "14",
    title: "Review Next Week Tasks",
    description:
      "Plan and prioritize tasks for the upcoming week",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse1,
    },
    dueDate: "5 Oct",
    status: "todo",
    scheduledDate: "2025-10-05",
    scheduledTime: "16:00",
  },

  // October 6, 2025 (Monday)
  {
    id: "15",
    title: "Sprint Planning Meeting",
    description: "Plan tasks for the upcoming 2-week sprint",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "6 Oct",
    status: "todo",
    scheduledDate: "2025-10-06",
    scheduledTime: "09:30",
  },
  {
    id: "16",
    title: "Database Migration Script",
    description:
      "Write and test migration script for user table changes",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "David Kim",
      avatar: imgEllipse2,
    },
    dueDate: "6 Oct",
    notes:
      "Make sure to backup production database before running. Test thoroughly on staging first.",
    status: "todo",
    scheduledDate: "2025-10-06",
    scheduledTime: "13:00",
  },
  {
    id: "17",
    title: "User Research Synthesis",
    description:
      "Analyze findings from last week's user interviews",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Jane Smith",
      avatar: imgEllipse2,
    },
    dueDate: "6 Oct",
    status: "todo",
    scheduledDate: "2025-10-06",
    scheduledTime: "15:00",
  },

  // October 7, 2025 (Tuesday)
  {
    id: "18",
    title: "Fix Critical Bug #342",
    description: "Payment processing error on checkout page",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Alex Rivera",
      avatar: imgEllipse2,
    },
    dueDate: "7 Oct",
    links: [{ text: "Bug Report #342", url: "#" }],
    status: "todo",
    scheduledDate: "2025-10-07",
    scheduledTime: "09:00",
  },
  {
    id: "19",
    title: "Marketing Campaign Review",
    description:
      "Review draft email campaign for product launch",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Emma Watson",
      avatar: imgEllipse1,
    },
    dueDate: "7 Oct",
    status: "todo",
    scheduledDate: "2025-10-07",
    scheduledTime: "11:00",
  },
  {
    id: "20",
    title: "Update Resume",
    description: "Add recent projects and achievements",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse2,
    },
    dueDate: "7 Oct",
    status: "todo",
    scheduledDate: "2025-10-07",
    scheduledTime: "19:00",
  },

  // October 8, 2025 (Wednesday)
  {
    id: "21",
    title: "Design System Updates",
    description: "Add new component variants to design system",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Jane Smith",
      avatar: imgEllipse2,
    },
    dueDate: "8 Oct",
    status: "todo",
    scheduledDate: "2025-10-08",
    scheduledTime: "10:00",
  },
  {
    id: "22",
    title: "API Documentation",
    description: "Document new endpoints for developer portal",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "David Kim",
      avatar: imgEllipse2,
    },
    dueDate: "8 Oct",
    status: "todo",
    scheduledDate: "2025-10-08",
    scheduledTime: "14:00",
  },
  {
    id: "23",
    title: "Coffee with Mentor",
    description: "Monthly career advice session",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "You",
      avatar: imgEllipse1,
    },
    dueDate: "8 Oct",
    status: "todo",
    scheduledDate: "2025-10-08",
    scheduledTime: "16:30",
  },

  // October 9, 2025 (Thursday)
  {
    id: "24",
    title: "Security Audit",
    description:
      "Review application for security vulnerabilities",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "David Kim",
      avatar: imgEllipse2,
    },
    dueDate: "9 Oct",
    status: "todo",
    scheduledDate: "2025-10-09",
    scheduledTime: "09:00",
  },
  {
    id: "25",
    title: "Quarterly Review Preparation",
    description:
      "Gather metrics and prepare presentation for quarterly review",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "9 Oct",
    files: [{ name: "Q3_Metrics.xlsx", icon: "file" }],
    status: "todo",
    scheduledDate: "2025-10-09",
    scheduledTime: "13:00",
  },

  // October 10, 2025 (Friday)
  {
    id: "26",
    title: "Production Deployment",
    description: "Deploy version 2.3.0 to production",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Alex Rivera",
      avatar: imgEllipse2,
    },
    dueDate: "10 Oct",
    notes:
      "Schedule deployment for 6 AM UTC to minimize user impact. Have rollback plan ready.",
    status: "todo",
    scheduledDate: "2025-10-10",
    scheduledTime: "09:00",
  },
  {
    id: "27",
    title: "Team Retro Meeting",
    description:
      "Sprint retrospective to discuss what went well and improvements",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "10 Oct",
    status: "todo",
    scheduledDate: "2025-10-10",
    scheduledTime: "15:00",
  },

  // October 11, 2025 (Saturday)
  {
    id: "28",
    title: "Hiking Trip",
    description: "Day hike at the state park with friends",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse2,
    },
    dueDate: "11 Oct",
    status: "todo",
    scheduledDate: "2025-10-11",
    scheduledTime: "08:00",
  },
  {
    id: "29",
    title: "Read Technical Articles",
    description: "Catch up on saved technical blog posts",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse1,
    },
    dueDate: "11 Oct",
    status: "todo",
    scheduledDate: "2025-10-11",
    scheduledTime: "18:00",
  },

  // October 12, 2025 (Sunday)
  {
    id: "30",
    title: "Family Video Call",
    description: "Weekly catchup with family",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "You",
      avatar: imgEllipse2,
    },
    dueDate: "12 Oct",
    status: "todo",
    scheduledDate: "2025-10-12",
    scheduledTime: "10:00",
  },

  // October 13, 2025 (Monday)
  {
    id: "31",
    title: "New Feature Kickoff",
    description:
      "Meeting to discuss requirements for social sharing feature",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Jane Smith",
      avatar: imgEllipse2,
    },
    dueDate: "13 Oct",
    status: "todo",
    scheduledDate: "2025-10-13",
    scheduledTime: "10:00",
  },
  {
    id: "32",
    title: "Refactor Authentication Logic",
    description:
      "Simplify auth flow and remove deprecated code",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "David Kim",
      avatar: imgEllipse2,
    },
    dueDate: "13 Oct",
    status: "todo",
    scheduledDate: "2025-10-13",
    scheduledTime: "14:00",
  },

  // October 14, 2025 (Tuesday)
  {
    id: "33",
    title: "Customer Support Training",
    description: "Train support team on new features",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Emma Watson",
      avatar: imgEllipse1,
    },
    dueDate: "14 Oct",
    status: "todo",
    scheduledDate: "2025-10-14",
    scheduledTime: "11:00",
  },
  {
    id: "34",
    title: "Performance Monitoring Review",
    description:
      "Analyze app performance metrics from last week",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Alex Rivera",
      avatar: imgEllipse2,
    },
    dueDate: "14 Oct",
    status: "todo",
    scheduledDate: "2025-10-14",
    scheduledTime: "15:00",
  },

  // October 15, 2025 (Wednesday)
  {
    id: "35",
    title: "Design Mockups for Dashboard",
    description:
      "Create high-fidelity mockups for new analytics dashboard",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Jane Smith",
      avatar: imgEllipse2,
    },
    dueDate: "15 Oct",
    files: [{ name: "Dashboard_v1.fig", icon: "file" }],
    status: "todo",
    scheduledDate: "2025-10-15",
    scheduledTime: "09:00",
  },
  {
    id: "36",
    title: "Competitor Analysis",
    description: "Research competing products and features",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "15 Oct",
    status: "todo",
    scheduledDate: "2025-10-15",
    scheduledTime: "14:00",
  },

  // October 16, 2025 (Thursday)
  {
    id: "37",
    title: "Unit Test Coverage",
    description:
      "Increase test coverage to 80% for core modules",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "David Kim",
      avatar: imgEllipse2,
    },
    dueDate: "16 Oct",
    status: "todo",
    scheduledDate: "2025-10-16",
    scheduledTime: "10:00",
  },
  {
    id: "38",
    title: "Blog Post Draft",
    description:
      "Write technical blog post about new architecture",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "Alex Rivera",
      avatar: imgEllipse2,
    },
    dueDate: "16 Oct",
    status: "todo",
    scheduledDate: "2025-10-16",
    scheduledTime: "15:30",
  },

  // October 17, 2025 (Friday)
  {
    id: "39",
    title: "All-Hands Meeting",
    description: "Company-wide meeting with Q3 updates",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "17 Oct",
    status: "todo",
    scheduledDate: "2025-10-17",
    scheduledTime: "14:00",
  },
  {
    id: "40",
    title: "Weekend Project Planning",
    description: "Plan personal coding project for weekend",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse2,
    },
    dueDate: "17 Oct",
    status: "todo",
    scheduledDate: "2025-10-17",
    scheduledTime: "17:00",
  },

  // October 18, 2025 (Saturday)
  {
    id: "41",
    title: "Car Maintenance",
    description: "Oil change and tire rotation",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "You",
      avatar: imgEllipse1,
    },
    dueDate: "18 Oct",
    status: "todo",
    scheduledDate: "2025-10-18",
    scheduledTime: "09:00",
  },
  {
    id: "42",
    title: "Work on Side Project",
    description:
      "Develop features for personal portfolio website",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse2,
    },
    dueDate: "18 Oct",
    status: "todo",
    scheduledDate: "2025-10-18",
    scheduledTime: "14:00",
  },

  // October 19, 2025 (Sunday)
  {
    id: "43",
    title: "Meal Prep",
    description: "Prepare healthy meals for the week",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "You",
      avatar: imgEllipse1,
    },
    dueDate: "19 Oct",
    status: "todo",
    scheduledDate: "2025-10-19",
    scheduledTime: "11:00",
  },

  // October 20, 2025 (Monday)
  {
    id: "44",
    title: "Sprint Planning",
    description:
      "Plan sprint goals and tasks for next two weeks",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "20 Oct",
    status: "todo",
    scheduledDate: "2025-10-20",
    scheduledTime: "09:30",
  },
  {
    id: "45",
    title: "Implement OAuth Integration",
    description: "Add Google and GitHub OAuth login options",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "David Kim",
      avatar: imgEllipse2,
    },
    dueDate: "20 Oct",
    status: "todo",
    scheduledDate: "2025-10-20",
    scheduledTime: "11:00",
  },
  {
    id: "46",
    title: "Wireframe Review",
    description: "Review wireframes for mobile app redesign",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Jane Smith",
      avatar: imgEllipse2,
    },
    dueDate: "20 Oct",
    status: "todo",
    scheduledDate: "2025-10-20",
    scheduledTime: "15:00",
  },

  // October 21, 2025 (Tuesday)
  {
    id: "47",
    title: "Bug Bash Session",
    description:
      "Team-wide bug hunting session for upcoming release",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Alex Rivera",
      avatar: imgEllipse2,
    },
    dueDate: "21 Oct",
    status: "todo",
    scheduledDate: "2025-10-21",
    scheduledTime: "13:00",
  },
  {
    id: "48",
    title: "Update Dependencies",
    description: "Update npm packages and fix breaking changes",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "David Kim",
      avatar: imgEllipse2,
    },
    dueDate: "21 Oct",
    status: "todo",
    scheduledDate: "2025-10-21",
    scheduledTime: "16:00",
  },

  // October 22, 2025 (Wednesday)
  {
    id: "49",
    title: "User Feedback Session",
    description: "Interview beta users about new features",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Emma Watson",
      avatar: imgEllipse1,
    },
    dueDate: "22 Oct",
    status: "todo",
    scheduledDate: "2025-10-22",
    scheduledTime: "10:00",
  },
  {
    id: "50",
    title: "Database Optimization",
    description:
      "Optimize slow queries and add missing indexes",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "David Kim",
      avatar: imgEllipse2,
    },
    dueDate: "22 Oct",
    status: "todo",
    scheduledDate: "2025-10-22",
    scheduledTime: "14:00",
  },

  // October 23, 2025 (Thursday)
  {
    id: "51",
    title: "Design System Workshop",
    description:
      "Workshop with designers to align on component standards",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Jane Smith",
      avatar: imgEllipse2,
    },
    dueDate: "23 Oct",
    status: "todo",
    scheduledDate: "2025-10-23",
    scheduledTime: "11:00",
  },
  {
    id: "52",
    title: "Invoice Review",
    description: "Review and approve vendor invoices",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "Mike Chen",
      avatar: imgEllipse1,
    },
    dueDate: "23 Oct",
    status: "todo",
    scheduledDate: "2025-10-23",
    scheduledTime: "15:00",
  },

  // October 24, 2025 (Friday)
  {
    id: "53",
    title: "Release Candidate Build",
    description: "Create release candidate for v2.4.0",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Alex Rivera",
      avatar: imgEllipse2,
    },
    dueDate: "24 Oct",
    status: "todo",
    scheduledDate: "2025-10-24",
    scheduledTime: "09:00",
  },
  {
    id: "54",
    title: "Team Lunch",
    description: "Celebrate project milestone with team lunch",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse1,
    },
    dueDate: "24 Oct",
    status: "todo",
    scheduledDate: "2025-10-24",
    scheduledTime: "12:30",
  },

  // October 25, 2025 (Saturday)
  {
    id: "55",
    title: "Yoga Class",
    description: "Morning yoga session at local studio",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "You",
      avatar: imgEllipse2,
    },
    dueDate: "25 Oct",
    status: "todo",
    scheduledDate: "2025-10-25",
    scheduledTime: "08:00",
  },
  {
    id: "56",
    title: "Clean Apartment",
    description: "Deep clean living space",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "You",
      avatar: imgEllipse1,
    },
    dueDate: "25 Oct",
    status: "todo",
    scheduledDate: "2025-10-25",
    scheduledTime: "11:00",
  },

  // October 26, 2025 (Sunday)
  {
    id: "57",
    title: "Online Course Module",
    description:
      "Complete module 3 of React Advanced Patterns course",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "You",
      avatar: imgEllipse2,
    },
    dueDate: "26 Oct",
    status: "todo",
    scheduledDate: "2025-10-26",
    scheduledTime: "14:00",
  },

  // October 27, 2025 (Monday)
  {
    id: "58",
    title: "Product Roadmap Review",
    description: "Review and update Q1 2026 product roadmap",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "27 Oct",
    status: "todo",
    scheduledDate: "2025-10-27",
    scheduledTime: "10:00",
  },
  {
    id: "59",
    title: "Implement Notification System",
    description:
      "Build real-time notification feature with WebSockets",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Alex Rivera",
      avatar: imgEllipse2,
    },
    dueDate: "27 Oct",
    status: "todo",
    scheduledDate: "2025-10-27",
    scheduledTime: "13:00",
  },

  // October 28, 2025 (Tuesday)
  {
    id: "60",
    title: "Accessibility Testing",
    description:
      "Test application with screen readers and keyboard navigation",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Jane Smith",
      avatar: imgEllipse2,
    },
    dueDate: "28 Oct",
    status: "todo",
    scheduledDate: "2025-10-28",
    scheduledTime: "10:00",
  },
  {
    id: "61",
    title: "Analytics Dashboard Updates",
    description: "Add new metrics to analytics dashboard",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "David Kim",
      avatar: imgEllipse2,
    },
    dueDate: "28 Oct",
    status: "todo",
    scheduledDate: "2025-10-28",
    scheduledTime: "14:30",
  },

  // October 29, 2025 (Wednesday)
  {
    id: "62",
    title: "Stakeholder Demo",
    description:
      "Present completed features to key stakeholders",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "high",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "29 Oct",
    status: "todo",
    scheduledDate: "2025-10-29",
    scheduledTime: "11:00",
  },
  {
    id: "63",
    title: "Code Quality Review",
    description:
      "Review codebase for technical debt and improvement opportunities",
    tags: [
      {
        text: "Project",
        bgColor: "#e8f5e8",
        textColor: "#0d7f0d",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Alex Rivera",
      avatar: imgEllipse2,
    },
    dueDate: "29 Oct",
    status: "todo",
    scheduledDate: "2025-10-29",
    scheduledTime: "15:00",
  },

  // October 30, 2025 (Thursday)
  {
    id: "64",
    title: "Halloween Party Planning",
    description: "Organize office Halloween celebration",
    tags: [
      {
        text: "Personal",
        bgColor: "#fbe6fc",
        textColor: "#ff00b8",
        fontWeight: "bold",
      },
    ],
    priority: "low",
    assignee: {
      name: "Emma Watson",
      avatar: imgEllipse1,
    },
    dueDate: "30 Oct",
    status: "todo",
    scheduledDate: "2025-10-30",
    scheduledTime: "16:00",
  },
  {
    id: "65",
    title: "Release Notes Draft",
    description: "Write release notes for v2.4.0",
    tags: [
      {
        text: "Work",
        bgColor: "#e1f6ff",
        textColor: "#2c62b4",
        fontWeight: "bold",
      },
    ],
    priority: "medium",
    assignee: {
      name: "Sarah Johnson",
      avatar: imgEllipse1,
    },
    dueDate: "30 Oct",
    status: "todo",
    scheduledDate: "2025-10-30",
    scheduledTime: "10:00",
  },
];

export function getTasksByStatus(
  status: Task["status"],
): Task[] {
  return sampleTasks.filter((task) => task.status === status);
}