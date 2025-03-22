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
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { show_form_error_message } from '@/common/error_message.js'
import InputText from '@/components/base/InputText.jsx'
import { API_URL } from '@/common/constant'

import Combobox from '@/components/base/ComboBox.jsx'
import { Loader2 } from 'lucide-react'
import DatePicker from '../base/DatePicker.jsx'
import moment from 'moment/moment.js'

const formSchema = z.object({
  date: z.coerce.date(),
  description: z.string().min(3).max(1000),
  amount: z.coerce.number(),
})

function IncomeModal({initialData = {}, open, setOpen}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {...initialData},
  })

  const navigate = useNavigate()

  const onSubmit = (data) => {
    data.date = moment(data.date).format('YYYY-MM-DD')

    if ('id' in initialData && initialData?.id !== null) {
      data.id = initialData.id
      mutationEdit.mutate(data)
    } else {
      mutation.mutate(data)
    }
  }

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${API_URL}/incomes`, data)
    },
    onSuccess: async () => {
      toast('Income created sucessfully')
      navigate(0)
    },
    onError: (error) => {
      if (error.status === 400) {
        show_form_error_message(form, error)
      }
    },
  })

  const mutationEdit = useMutation({
    mutationFn: (data) => {
      return axios.patch(`${API_URL}/incomes/${data.id}`, data)
    },
    onSuccess: async () => {
      toast('Income updated sucessfully')
      navigate(0)
    },
    onError: (error) => {
      if (error.status === 400) {
        show_form_error_message(form, error)
      }
    },
  })

  useEffect(() => {
    form.reset()
  }, [open])

  useEffect(() => {
    form.reset(initialData)
  }, [initialData])

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
                    name="date"
                    render={({ field }) => (<DatePicker label="Date" field={field}/>)}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <InputText name="description" label="Description" placeholder="Description" field={field}/>)}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <InputText name="amount" type="number" label="Amount" placeholder="Amount" field={field} />)}
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

export default IncomeModal