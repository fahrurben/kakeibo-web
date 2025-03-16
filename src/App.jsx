import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from "@/components/ui/sonner"

import Register from './pages/register.jsx'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import LoginPage from './pages/loginPage.jsx'
import ExpenseCategory from './pages/expenseCategory.jsx'
import { clsx } from 'clsx'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from './components/custom/AppSidebar.jsx'
import HomePage from './pages/homePage.jsx'

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <BrowserRouter>
          <div>
            <AppSidebar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/expense-category" element={<ExpenseCategory />} />
            </Routes>
            <Toaster />
          </div>
        </BrowserRouter>
      </SidebarProvider>
    </QueryClientProvider>
  )
}

export default App
