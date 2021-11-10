export { autoCompleter, autoComplete } from "../controls/autoCompleter.control"
export { checkbox, checkboxes, checked } from "../controls/checkbox.control"
export { datePicker, dateToPick } from "../controls/datePicker.control"
export { dropdown, option } from "../controls/dropdown.control"
export { radio, radioText } from "../controls/radio.control"
export { upload, file } from "../controls/upload.control"

export const value = (value) => ({
  value,
  toString() { return value.toString() }
})