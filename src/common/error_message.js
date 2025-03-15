export function show_form_error_message (form, error) {
  let errorMessages = error.response.data?.message
  if (typeof errorMessages === 'object') {
    for (let key in errorMessages) {
      form.setError(key, {
        type: 'manual',
        message: errorMessages[key],
      })
    }
  }
}

