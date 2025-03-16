import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from "@/components/ui/sonner"

import Register from './pages/register.jsx'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import LoginPage from './pages/loginPage.jsx'

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
