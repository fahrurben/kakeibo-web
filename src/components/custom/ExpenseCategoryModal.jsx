import { cn } from '@/common/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'

import {
  Form,
  FormField,
} from '@/components/ui/form'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import moment from 'moment'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { show_form_error_message } from '@/common/error_message.js'
import InputText from '@/components/base/InputText.jsx'
import { API_URL, EXPENSE_CATEGORY_TYPE  } from '@/common/constant'

import { useAuth } from "@/provider/authProvider.jsx"
import Combobox from '@/components/base/ComboBox.jsx'
import { mapToOptions } from '@/common/utils.js'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  type: z.string(),
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(1000),
})


function ExpenseCategoryModal({open, setOpen}) {
  const { token, setToken } = useAuth()
  const expenseCategoryOptions = mapToOptions(EXPENSE_CATEGORY_TYPE)

  const form = useForm({
    resolver: zodResolver(formSchema),
  })
  const navigate = useNavigate()

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${API_URL}/expense-categories`, data)
    },
    onSuccess: async (data) => {
      toast('Expense category created sucessfully')
      navigate(0)
    },
    onError: (error, variables, context) => {
      if (error.status === 400) {
        show_form_error_message(form, error)
      }
    },
  })

  useEffect(() => {
    form.reset()
  }, [open])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={cn("mb-4")}>New</DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <Combobox name="type" field={field} label="Type" options={expenseCategoryOptions} />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <InputText name="name" label="Name" placeholder="Name" field={field}/>)}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <InputText name="description" label="Description" placeholder="Description" field={field}/>)}
                  />
                  <div className={'flex justify-end'}>
                    <Button type="submit" onClick={() => form.handleSubmit(onSubmit)}>
                      { mutation.isPending ? (<Loader2 className="animate-spin" />) : null }
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>

  )
}

export default ExpenseCategoryModal