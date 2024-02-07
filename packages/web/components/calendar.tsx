import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns"

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ")
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

const Calendar = () => {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"))
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

  const days = [
    "2024-01-31T23:00:00.000Z",
    "2024-02-01T23:00:00.000Z",
    "2024-02-02T23:00:00.000Z",
    "2024-02-03T23:00:00.000Z",
    "2024-02-04T23:00:00.000Z",
    "2024-02-05T23:00:00.000Z",
    "2024-02-06T23:00:00.000Z",
    "2024-02-07T23:00:00.000Z",
    "2024-02-08T23:00:00.000Z",
    "2024-02-09T23:00:00.000Z",
    "2024-02-10T23:00:00.000Z",
    "2024-02-11T23:00:00.000Z",
    "2024-02-12T23:00:00.000Z",
    "2024-02-13T23:00:00.000Z",
    "2024-02-14T23:00:00.000Z",
    "2024-02-15T23:00:00.000Z",
    "2024-02-16T23:00:00.000Z",
    "2024-02-17T23:00:00.000Z",
    "2024-02-18T23:00:00.000Z",
    "2024-02-19T23:00:00.000Z",
    "2024-02-20T23:00:00.000Z",
    "2024-02-21T23:00:00.000Z",
    "2024-02-22T23:00:00.000Z",
    "2024-02-23T23:00:00.000Z",
    "2024-02-24T23:00:00.000Z",
    "2024-02-25T23:00:00.000Z",
    "2024-02-26T23:00:00.000Z",
    "2024-02-27T23:00:00.000Z",
    "2024-02-28T23:00:00.000Z",
  ]
  return (
    <div className="bg-white/50 p-4">
      <div className="flex items-center">
        <h2 className="flex-auto font-semibold text-gray-900">
          February 2024
        </h2>
        <button
          type="button"
          onClick={() => {}}
          className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => {}}
          type="button"
          className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-7 mt-2 text-xs leading-6 text-center text-gray-500">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={classNames(
              dayIdx === 0 && colStartClasses[getDay(day)],
              "py-1"
            )}
          >
            <button
              type="button"
              onClick={() => setSelectedDay(new Date(day))}
              className={classNames(
                isEqual(day, selectedDay) && "text-white",
                !isEqual(day, selectedDay) && isToday(day) && "text-red-500",
                !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  isSameMonth(day, firstDayCurrentMonth) &&
                  "text-gray-900",
                !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  !isSameMonth(day, firstDayCurrentMonth) &&
                  "text-gray-400",
                isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
                isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
                !isEqual(day, selectedDay) && "hover:bg-gray-200",
                (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                "mx-auto flex h-6 w-6 items-center justify-center rounded-full"
              )}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
