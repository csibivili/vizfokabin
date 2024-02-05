import { ChangeEvent } from "react"

interface Props {
  label: string
  setDate: (date: Date, label:string) => void
  value: string
}

const DateSelector: React.FC<Props> = ({ label, setDate, value }) => {
  const handleDateChange = (date: ChangeEvent<HTMLInputElement>) => {
    setDate(new Date(date.target.value), label)
  }

  return (
    <div className="h-20 border-l-2 pl-4 flex flex-col ml-10">
      <label className="text-white">{label}</label>
      <div className="flex items-center">
        <input type="date" className="w-40 h-10 bg-white/50 px-2" onChange={handleDateChange} value={value} />
      </div>
    </div>
  )
}

export default DateSelector
