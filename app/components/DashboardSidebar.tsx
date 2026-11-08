"use client"

import {
  BookmarkIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  Plus,
  SettingsIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"

import type { UserRole } from "@/type/type"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"

export type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

// Nav items per role, taken from the Figma "HL 2.0/Sidebar" component
// (Role=Seeker / Role=Recruiter / Role=Admin variants).
const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  seeker: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboardIcon },
    { id: "jobs", name: "Jobs", url: "/dashboard/seeker/jobs", icon: BriefcaseBusinessIcon },
    { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: BookmarkIcon },
    { id: "applications", name: "Applications", url: "/dashboard/seeker/applications", icon: FileTextIcon },
    { id: "billing", name: "Billing", url: "/dashboard/seeker/billing", icon: CreditCardIcon },
    { id: "settings", name: "Settings", url: "/dashboard/seeker/settings", icon: SettingsIcon },
  ],
  recruiter: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboardIcon },
    { id: "my-company", name: "My Company", url: "/dashboard/recruiter/company", icon: Building2Icon },
    { id: "manage-jobs", name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: BriefcaseBusinessIcon },
    { id: "add-job", name: "Add Jobs", url: "/dashboard/recruiter/jobs/new", icon: Plus },
    { id: "applications", name: "Applications", url: "/dashboard/recruiter/applications", icon: UsersRoundIcon },
    { id: "settings", name: "Settings", url: "/dashboard/recruiter/settings", icon: SettingsIcon },
  ],
  admin: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboardIcon },
    { id: "users", name: "Users", url: "/dashboard/admin/users", icon: UsersRoundIcon },
    { id: "companies", name: "Companies", url: "/dashboard/admin/companies", icon: Building2Icon },
    { id: "jobs", name: "Jobs", url: "/dashboard/admin/jobs", icon: BriefcaseBusinessIcon },
    { id: "payments", name: "Payments", url: "/dashboard/admin/payments", icon: CreditCardIcon },
    { id: "settings", name: "Settings", url: "/dashboard/admin/settings", icon: SettingsIcon },
  ],
}

const DashboardSidebar = () => {
  const { data: session } = useSession()
  // default to seeker if no role found
  const rawRole = session?.user?.role
  const role: UserRole =
    rawRole === "recruiter" || rawRole === "admin" ? rawRole : "seeker"

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {menuItemsByRole[role].map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton render={<Link href={item.url} />}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default DashboardSidebar
