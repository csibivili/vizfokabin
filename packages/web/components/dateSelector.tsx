interface Props {
  label: string
}

const DateSelector: React.FC<Props> = ({ label }) => {
  return (
    <div className="h-20 border-l-2 pl-4 flex flex-col ml-10">
      <label className="text-white">{label}</label>
      <div className="flex items-center">
        <input type="date" className="w-40 h-10 bg-white/50 px-2" />
      </div>
    </div>
  )
}

export default DateSelector
