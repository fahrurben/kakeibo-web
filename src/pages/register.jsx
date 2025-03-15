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
import DatePicker from '../components/base/DatePicker.jsx'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import moment from 'moment'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { show_form_error_message } from '../common/error_message.js'
import InputText from '../components/base/InputText.jsx'

const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  birthday: z.date(),
})

function Register () {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })
  const navigate = useNavigate()

  const onSubmit = (data) => {
    console.log(data)
    data.birthday = moment(data.birthday).format('YYYY-MM-DD')
    mutation.mutate(data)
  }

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post('http://127.0.0.1:8000/api/register/', data)
    },
    onSuccess: () => {
      toast('Register success')
      navigate('/')
    },
    onError: (error, variables, context) => {
      if (error.status === 400) {
        show_form_error_message(form, error)
      }
    },
  })

  const [date, setDate] = useState(new Date())

  return (
    <div className={cn(
      'flex flex-col w-screen h-screen justify-center items-center')}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
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
                name="username"
                render={({ field }) => (
                  <InputText name="username" placeholder="Username" field={field}/>)}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <InputText name="password" placeholder="Password" type="password"
                             field={field}/>)}
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (<DatePicker field={field}/>)}
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

export default Register