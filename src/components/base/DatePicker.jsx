import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import * as React from 'react'
import { FormLabel } from '../ui/form.js'

function DatePicker ({ field, label = "" }) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = useState(field.value)

  const onChange = (date) => {
    field.onChange(date)
    setDate(date)
    setOpen(false)
  }

  return (
    <FormItem>
      {label !== ''
        ? <FormLabel>{<label for={name}>{label}</label>}</FormLabel>
        : null}
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )}
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4"/>
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage/>
    </FormItem>
  )
}

export default DatePicker