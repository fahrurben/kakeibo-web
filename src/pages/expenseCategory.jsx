import React, { useEffect, useState } from 'react'
import { cn } from '@/common/cn.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import DataTable from '@/components/base/DataTable.jsx'
import axios from 'axios'
import { Button } from '@/components/ui/button.js'
import { Plus } from 'lucide-react'
import Loading from '@/components/base/Loading.jsx'
import ExpenseCategoryModal from '@/components/custom/ExpenseCategoryModal.jsx'
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
import { checkAuth } from '../common/utils.js'
import { useAuth } from '../provider/authProvider.jsx'

function ExpenseCategory() {
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth(token, navigate)
  }, [])

  const columns = [
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

  const { isPending, data } = useQuery({
    queryKey: ['expense-categories'],
    queryFn: () => {
      return axios.get(`${API_URL}/expense-categories`)
    },
  })

  const mutationDelete = useMutation({
    mutationFn: (data) => {
      return axios.delete(`${API_URL}/expense-categories/${data.id}`)
    },
    onSuccess: async () => {
      toast('Expense category deleted sucessfully')
      navigate(0)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const getPost = async (id) => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${API_URL}/expense-categories/${id}`)

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
    const data = await getPost(id)
    setInitialData(data)
    setOpen(true)
  }
  const deleteClicked = (data) => {
    setShowDeleteConfirmation(true)
    setSelectedCategory(data)
  }

  return (
      <>
        <div className={cn("flex")}>
          <h1 className={cn('text-lg font-bold mb-4')}>Expense Category</h1>
          <Button size="icon" className={cn("ml-auto")} onClick={() => showCreateModal()}>
            <Plus/>
          </Button>
        </div>
        <DataTable columns={columns} data={data?.data?.results ?? []}/>
        <ExpenseCategoryModal initialData={initialData} open={open} setOpen={setOpen}/>
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

export default ExpenseCategory