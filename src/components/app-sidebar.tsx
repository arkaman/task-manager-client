"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/api/userApi"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { CalendarClock, CalendarArrowUp, SquareCode } from "lucide-react"

type Props = React.ComponentProps<typeof Sidebar> & {
  onStatusChange: (status: "ALL" | "PENDING" | "COMPLETE") => void
  onPriorityChange: (priority: "ALL" | "LOW" | "MEDIUM" | "HIGH") => void
}

export function AppSidebar({
  onStatusChange,
  onPriorityChange,
  ...props
}: Props) {
  const [user, setUser] = useState<{
    name: string
    email: string
    avatar: string
  } | null>(null)
  const [status, setStatus] = useState<"ALL" | "PENDING" | "COMPLETE">("ALL")
  const [priority, setPriority] = useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL")

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser()
        setUser({
          name: data.username,
          email: data.email,
          avatar: "/avatars/default.png",
        })
      } catch (err) {
        console.error("Failed to load user", err)
      }
    }

    loadUser()
  }, [])

  if (!user) return null

  // handlers that update BOTH local + parent state
  const handleStatus = (val: typeof status) => {
    setStatus(val)
    onStatusChange(val)
  }

  const handlePriority = (val: typeof priority) => {
    setPriority(val)
    onPriorityChange(val)
  }

  return (
    <Sidebar variant="inset" {...props}>
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <img src="favicon.svg" className="size-8" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Task</span>
                <span className="truncate text-xs">Manager</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <NavMain
          items={[
            {
              title: "Status",
              icon: <CalendarClock />,
              isActive: true,
              items: [
                { title: "All", active: status === "ALL", onClick: () => handleStatus("ALL") },
                { title: "Pending", active: status === "PENDING", onClick: () => handleStatus("PENDING") },
                { title: "Complete", active: status === "COMPLETE", onClick: () => handleStatus("COMPLETE") },
              ],
            },
            {
              title: "Priority",
              icon: <CalendarArrowUp />,
              isActive: true,
              items: [
                { title: "All", active: priority === "ALL", onClick: () => handlePriority("ALL") },
                { title: "High", active: priority === "HIGH", onClick: () => handlePriority("HIGH") },
                { title: "Medium", active: priority === "MEDIUM", onClick: () => handlePriority("MEDIUM") },
                { title: "Low", active: priority === "LOW", onClick: () => handlePriority("LOW") },
              ],
            },
          ]}
        />

        <NavSecondary
          items={[
            {
              title: "Source Code",
              url: "https://github.com/arkaman/task-manager-client",
              icon: <SquareCode />,
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}