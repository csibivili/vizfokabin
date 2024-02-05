import { useState, FC } from "react"

interface Props {
  value: number | null
  setValue: (value: number) => void
}

const NumberOfGuests: FC<Props> = ({ value, setValue }) => {
  const [visible, setVisible] = useState(false)
  const select = (value: number) => {
    setVisible(false)
    setValue(value)
  }
  return (
    <div className="h-20 border-l-2 pl-4 flex flex-col ml-10">
      <label className="text-white">Guests</label>
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 bg-white/50 px-3 py-2"
            onClick={() => setVisible(!visible)}
          >
            {!value ? "Please select" : value}
            <svg
              className="mt-1 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {visible && (
          <div className="absolute right-0 z-10 mt-2 w-16 bg-white shadow-lg">
            <div className="py-1" role="none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="block px-4 py-1 text-sm text-right hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => select(i + 1)}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NumberOfGuests
