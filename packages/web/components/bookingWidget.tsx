"use client"

import { useState, FC } from "react"

import DateSelector from "./dateSelector"
import NumberOfGuests from "./numberOfGuests"

interface Props {}

const BookingWidget: FC<Props> = () => {
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [numberOfGuests, setNumberOfGuests] = useState(2)

  return (
    <div className="w-full flex">
      <DateSelector label="Check-in" />
      <DateSelector label="Check-out" />
      <NumberOfGuests value={numberOfGuests} />
      <div className="ml-auto self-center mr-32">
        <button className="bg-white px-8 py-4 font-semibold uppercase cursor-pointer hover:bg-black hover:text-white">Book now</button>
      </div>
    </div>
  )
}

export default BookingWidget
