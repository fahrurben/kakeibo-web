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

function DatePicker ({ field }) {
  const [date, setDate] = useState(field.value)

  const onChange = (date) => {
    field.onChange(date)
    setDate(date)
  }

  return (
    <FormItem>
      <FormControl>
        <Popover>
          <PopoverTrigger>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )}
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