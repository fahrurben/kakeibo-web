import { cn } from '../common/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Form,
  FormField,
} from '@/components/ui/form'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { show_form_error_message } from '../common/error_message.js'
import InputText from '../components/base/InputText.jsx'
import { API_URL } from '../common/constant'

import { useAuth } from "../provider/authProvider.jsx"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

function LoginPage () {
  const { setToken } = useAuth()

  const form = useForm({
    resolver: zodResolver(formSchema),
  })
  const navigate = useNavigate()

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${API_URL}/token/`, data)
    },
    onSuccess: async (data) => {
      let token = data.data.access
      await axios.get(`${API_URL}/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setToken(token)
      toast('Login success')
      navigate('/')
    },
    onError: (error) => {
      if (error.status === 400) {
        show_form_error_message(form, error)
      } else if (error.status === 401) {
        toast('Wrong username or password')
      }
    },
  })

  return (
    <div className={cn(
      'flex flex-col w-screen h-screen justify-center items-center')}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <InputText name="email" placeholder="Email" field={field}/>)}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <InputText name="password" placeholder="Password"
                             type="password"
                             field={field}/>)}
              />
              <div className={'flex justify-end'}>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage