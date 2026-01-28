import {
  BarChart3,
  CheckSquare,
  FileText,
  Inbox,
  LayoutDashboard,
  Settings,
} from "lucide-react"

export const dashboardNavItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    url: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Inbox",
    url: "/dashboard/inbox",
    icon: Inbox,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Automation",
    url: "/dashboard/automation",
    icon: Settings,
  },
]
