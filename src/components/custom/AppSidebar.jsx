import { Home, Settings, LayoutGrid, CirclePower } from 'lucide-react'

import { Link } from 'react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '',
    icon: Home,
  },
  {
    title: 'Expense Category',
    url: '/expense-category',
    icon: LayoutGrid,
  },
  {
    title: 'Income',
    url: '/income',
    icon: LayoutGrid,
  },
  {
    title: 'Expense',
    url: '/expense',
    icon: LayoutGrid,
  },
  {
    title: 'Logout',
    url: '/logout',
    icon: CirclePower,
  },
]

export function AppSidebar () {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Kakeibo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}