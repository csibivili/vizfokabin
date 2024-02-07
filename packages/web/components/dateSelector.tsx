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
    <div className="flex flex-col">
      <label className="text-white my-2">{label}</label>
      {/* <Calendar /> */}
      <div className="flex items-center">
        <input type="date" className="w-40 h-10 bg-white/50 px-2" onChange={handleDateChange} value={value} />
      </div>
    </div>
  )
}

export default DateSelector
