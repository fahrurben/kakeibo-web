import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '../ui/textarea.js'

function InputTextArea ({
  name,
  field,
  label = '',
  placeholder = '',
}) {
  return (
    <FormItem>
      {label !== ''
        ? <FormLabel>{<label for={name}>{label}</label>}</FormLabel>
        : null}
      <FormControl>
        <Textarea placeholder={placeholder} {...field} />
      </FormControl>
      <FormMessage/>
    </FormItem>
  )
}

export default InputTextArea