"use client"

import { useState, FC } from "react"

import DateSelector from "./dateSelector"
import NumberOfGuests from "./numberOfGuests"

interface Props {}

const BookingWidget: FC<Props> = () => {
  const [checkIn, setCheckIn] = useState<Date>(new Date())
  const [checkOut, setCheckOut] = useState<Date>(new Date())
  const [numberOfGuests, setNumberOfGuests] = useState<number | null>(null)

  const handleDateChange = (date: Date, label: string) => { 
    switch (label) {
      case "Check-in":
        setCheckIn(date)
        break
      case "Check-out":
        setCheckOut(date)
        break
      default:
        console.error("Invalid label")
        break
    }
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const bookNow = async () => {
    await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkIn,
        checkOut,
        numberOfGuests,
      }),
    })
  }

  return (
    <div className="w-full flex">
      <DateSelector label="Check-in" value={formatDate(checkIn)} setDate={handleDateChange} />
      <DateSelector label="Check-out" value={formatDate(checkOut)} setDate={handleDateChange} />
      <NumberOfGuests value={numberOfGuests} setValue={setNumberOfGuests} />
      <div className="ml-auto self-center mr-32">
        <button
          onClick={bookNow}
          className="bg-white px-8 py-4 font-semibold uppercase cursor-pointer hover:bg-black hover:text-white"
        >
          Book now
        </button>
      </div>
    </div>
  )
}

export default BookingWidget
