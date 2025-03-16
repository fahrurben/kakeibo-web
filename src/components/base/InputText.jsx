import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

function InputText ({
  name,
  field,
  label = '',
  placeholder = '',
  type = 'text',
}) {
  return (
    <FormItem>
      {label !== ''
        ? <FormLabel>{<label for={name}>{label}</label>}</FormLabel>
        : null}
      <FormControl>
        <Input type={type} placeholder={placeholder} {...field} />
      </FormControl>
      <FormMessage/>
    </FormItem>
  )
}

export default InputText