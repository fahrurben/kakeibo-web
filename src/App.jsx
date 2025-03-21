import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from "@/components/ui/sonner"

import Register from './pages/register.jsx'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import LoginPage from './pages/loginPage.jsx'
import ExpenseCategory from './pages/expenseCategory.jsx'
import { SidebarProvider } from "@/components/ui/sidebar"
import HomePage from './pages/homePage.jsx'
import AuthProvider from "./provider/authProvider";
import MainLayout from './pages/mainLayout.jsx'
import IncomePage from './pages/incomePage.jsx'
import ExpensePage from './pages/expensePage.jsx'
import LogoutPage from './pages/logout.jsx'

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/logout" element={<LogoutPage/>}/>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage/>}/>
                  <Route path="/expense-category" element={<ExpenseCategory/>}/>
                  <Route path="/income" element={<IncomePage />} />
                  <Route path="/expense" element={<ExpensePage />} />
                </Route>
              </Routes>
              <Toaster/>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
