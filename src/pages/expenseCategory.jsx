import { Navigate } from 'react-router'
import React, { useState } from 'react'
import { useAuth } from "@/provider/authProvider.jsx"
import { cn } from '@/common/cn.js'
import { useQuery } from '@tanstack/react-query'
import DataTable from '@/components/base/DataTable.jsx'
import axios from 'axios'
import { SidebarTrigger } from '../components/ui/sidebar.js'
import { Button } from '@/components/ui/button.js'
import { Plus } from 'lucide-react'
import Loading from '@/components/base/Loading.jsx'
import ExpenseCategoryModal from '@/components/custom/ExpenseCategoryModal.jsx'
import Combobox from '../components/base/ComboBox.jsx'

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
    accessorFn: row => `${row.is_active ? 'Yes' : 'No'}`,
    header: "Is Active",
    meta: {
      align: 'center'
    },
  },
]

function ExpenseCategory() {
  const { token } = useAuth()
  const [open, setOpen] = useState(false)

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
          <Button size="icon" className={cn("ml-auto")} onClick={() => setOpen(true)}>
            <Plus/>
          </Button>
        </div>
        <DataTable columns={columns} data={data?.data?.results ?? []}/>
        <ExpenseCategoryModal open={open} setOpen={setOpen}/>
        <Loading isPending={isPending} />
      </>
  )
}

export default ExpenseCategory