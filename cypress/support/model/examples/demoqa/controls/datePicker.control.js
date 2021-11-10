import { Component } from "../components/component"

export const datePicker = (selector) => ({
  ...Component,
  selector,
  pick({day, month, year}) {
    this.element().find('.react-datepicker-wrapper').click()

    if (month) {
      this.element().find(".react-datepicker__month-select").get().select(month)
    }

    if (year) {
      this.element().find(".react-datepicker__year-select").get().select(
        (year).toString()
      )
    }
    
    if (day) this.element().find(".react-datepicker__day--0" + day).click()
  },
})

// export const dateToPick = ({day, month, year}) => (
//   (selector) => datePicker(selector).pick({day, month, year})
// )

export const dateToPick = ({day, month, year}) => ({
  set: (selector) => datePicker(selector).pick({day, month, year}),
  value: {day, month, year},
})