export function mapToOptions(obj) {
  let options = []
  for (const [value, label] of Object.entries(obj)) {
    options.push({value: value, label: label})
  }
  return options
}