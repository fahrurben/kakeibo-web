import React, { useEffect, useState } from 'react'
import { cn } from '@/common/cn.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import DataTable from '@/components/base/DataTable.jsx'
import axios from 'axios'
import { Button } from '@/components/ui/button.js'
import { Plus } from 'lucide-react'
import Loading from '@/components/base/Loading.jsx'
import { API_URL  } from '@/common/constant'

import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import IncomeModal from '../components/custom/incomeModal.jsx'
import Combobox from '../components/base/ComboBox.jsx'
import { checkAuth, mapToOptions } from '../common/utils.js'
import { MONTH_LIST, START_YEAR } from '../common/constant.js'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import DatePicker from '../components/base/DatePicker.jsx'
import {
  Form,
  FormField,
} from '@/components/ui/form'
import moment from 'moment'
import ExpenseModal from '../components/custom/expenseModal.jsx'
import { useAuth } from '../provider/authProvider.jsx'

function ExpensePage() {
  const currentMonth = (moment().month() + 1).toString()
  const currentYear = START_YEAR
  const { token } = useAuth()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(START_YEAR)
  const [initialData, setInitialData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  useEffect(() => {
    checkAuth(token, navigate)
  }, [])

  let yearOptions = []
  for (let y=START_YEAR; y <= moment().year(); y++) {
    yearOptions.push({"label": y, "value": y.toString() })
  }

  const columns = [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <DropdownMenu>
            <DropdownMenuTrigger >
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => showEditModal(id)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteClicked(row.original)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  const filterFormSchema = z.object({
    month: z.string(),
    year: z.string(),
  })

  const form = useForm({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {month: month, year: year.toString()},
  })

  const { isPending, data } = useQuery({
    queryKey: ['expenses', month, year],
    queryFn: () => {
      return axios.get(`${API_URL}/expenses?month=${month}&year=${year}`)
    },
  })

  const mutationDelete = useMutation({
    mutationFn: (data) => {
      return axios.delete(`${API_URL}/expenses/${data.id}`)
    },
    onSuccess: async () => {
      toast('Income deleted sucessfully')
      navigate(0)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const getIncome = async (id) => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${API_URL}/expenses/${id}`)

      setIsLoading(false)
      return response.data
    } catch (e) {
      console.log(e)
    }

    setIsLoading(false)
    return null
  }
  const showCreateModal = () => {
    setOpen(true)
  }

  const showEditModal = async (id) => {
    const data = await getIncome(id)
    data.category_id = data.category_id.toString()
    setInitialData(data)
    setOpen(true)
  }
  const deleteClicked = (data) => {
    setShowDeleteConfirmation(true)
    setSelectedCategory(data)
  }

  const filterOnSubmit = (data) => {
    setMonth(data.month)
    setYear(data.year)
  }

  return (
    <>
      <div className={cn("flex")}>
        <h1 className={cn('text-lg font-bold')}>Expense</h1>
        <Button size="icon" className={cn("ml-auto")} onClick={() => showCreateModal()}>
          <Plus/>
        </Button>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(filterOnSubmit)} className="space-y-8 flex flex-row gap-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <Combobox name="month" field={field} options={mapToOptions(MONTH_LIST)} />
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <Combobox name="year" field={field} options={yearOptions} />
              )}
            />
            <Button className={cn("mt-2")}>Go</Button>
          </form>
        </Form>
      </div>
      <DataTable columns={columns} data={data?.data?.results ?? []}/>
      <ExpenseModal initialData={initialData} open={open} setOpen={setOpen} />
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure to delete {selectedCategory?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutationDelete.mutate(selectedCategory)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Loading isPending={isPending || isLoading} />
    </>
  )
}

export default ExpensePage