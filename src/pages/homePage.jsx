import React, { useEffect, useState } from 'react'

import { cn } from '../common/cn.js'
import { useAuth } from '../provider/authProvider.jsx'
import { useNavigate } from 'react-router'
import Combobox from '../components/base/ComboBox.jsx'
import { checkAuth, mapToOptions } from '../common/utils.js'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormField,
} from '@/components/ui/form'
import moment from 'moment'

import axios from 'axios'
import { Button } from '@/components/ui/button.js'
import Loading from '@/components/base/Loading.jsx'
import { API_URL  } from '@/common/constant'
import { MONTH_LIST, START_YEAR } from '../common/constant.js'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'

function HomePage() {
  const currentMonth = (moment().month() + 1).toString()
  const currentYear = START_YEAR

  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(START_YEAR)
  const { token } = useAuth()
  const navigate = useNavigate()

  let yearOptions = []
  for (let y=START_YEAR; y <= moment().year(); y++) {
    yearOptions.push({"label": y, "value": y.toString() })
  }

  useEffect(() => {
    checkAuth(token, navigate)
  }, [])
  const filterFormSchema = z.object({
    month: z.string(),
    year: z.string(),
  })

  const form = useForm({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {month: month, year: year.toString()},
  })

  const { data:incomeData } = useQuery({
    queryKey: ['incomes', month, year],
    queryFn: () => {
      return axios.get(`${API_URL}/incomes/monthly_total?month=${month}&year=${year}`)
    },
  })

  const { data:expenseData } = useQuery({
    queryKey: ['expenses', month, year],
    queryFn: () => {
      return axios.get(`${API_URL}/expenses/monthly_total?month=${month}&year=${year}`)
    },
  })

  const filterOnSubmit = (data) => {
    setMonth(data.month)
    setYear(data.year)
  }

  return (
    <div className={cn('p-[20px]')}>
      <h1 className={cn("text-3xl font-bold")}>Dashboard</h1>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(filterOnSubmit)}
                className="space-y-8 flex flex-row gap-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <Combobox name="month" field={field}
                          options={mapToOptions(MONTH_LIST)}/>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <Combobox name="year" field={field} options={yearOptions}/>
              )}
            />
            <Button className={cn("mt-2")}>Go</Button>
          </form>
        </Form>
      </div>
      <div className={cn("flex flex-row gap-4")}>
        <Card className={cn("grow")}>
          <CardHeader>
            <CardTitle>Total Monthly Income</CardTitle>
            <CardDescription>Total income for a month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={cn(
              'text-lg font-bold text-right')}>$ {new Intl.NumberFormat(
              'en-US').format(incomeData?.data?.amount__sum)}</p>
          </CardContent>
        </Card>
        <Card className={cn('grow')}>
          <CardHeader>
            <CardTitle>Total Monthly Expense</CardTitle>
            <CardDescription>Total expense for a month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={cn(
              "text-lg font-bold text-right")}>$ {new Intl.NumberFormat(
              "en-US").format(expenseData?.data?.amount__sum)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage