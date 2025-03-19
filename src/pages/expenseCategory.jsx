import { Navigate } from 'react-router'
import React from 'react'
import { useAuth } from "../provider/authProvider.jsx"
import { cn } from '../common/cn.js'
import { useQuery } from '@tanstack/react-query'
import DataTable from '../components/base/DataTable.jsx'
import axios from 'axios'
import { SidebarTrigger } from '../components/ui/sidebar.js'
import { Button } from '../components/ui/button.js'
import { Plus } from 'lucide-react'
import Loading from '../components/base/Loading.jsx'

export const columns = [
  {
    accessorKey: "type_label",
    header: "Type",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "is_active",
    header: "Is Active",
  },
]

function ExpenseCategory() {
  const { token } = useAuth()

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['expense-categories'],
    queryFn: () => {
      return axios.get('http://127.0.0.1:8000/api/expense-categories')
    },
  })

  return (
      <>
        <div className={cn("flex")}>
          <h1 className={cn('text-lg font-bold mb-4')}>Expense Category</h1>
          <Button size="icon" className={cn("ml-auto")}>
            <Plus/>
          </Button>
        </div>
        <DataTable columns={columns} data={data?.data?.results ?? []}/>
        <Loading isPending={isPending} />
      </>
  )
}

export default ExpenseCategory