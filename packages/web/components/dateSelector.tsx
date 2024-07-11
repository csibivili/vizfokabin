import { ChangeEvent } from "react"
import Calendar from "./calendar"

interface Props {
  label: string
  setDate: (date: Date, label: string) => void
  value: string
}

const DateSelector: React.FC<Props> = ({ label, setDate, value }) => {
  const handleDateChange = (date: ChangeEvent<HTMLInputElement>) => {
    setDate(new Date(date.target.value), label)
  }

  return (
    <div className="flex flex-col mr-5">
      <label className="text-white mb-2">{label}</label>
      <div className="grid grid-cols-2">
        <Calendar />
        <Calendar />
      </div>
    </div>
  )
}

export default DateSelector
