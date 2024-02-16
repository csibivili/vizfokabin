"use client"

import { useState, FC, useEffect } from "react"

import DateSelector from "./dateSelector"
import NumberOfGuests from "./numberOfGuests"

const BookingWidget: FC = () => {
  const [checkIn, setCheckIn] = useState<Date>(new Date()) //todo: set to zero
  const [checkOut, setCheckOut] = useState<Date>(new Date())
  const [numberOfGuests, setNumberOfGuests] = useState<number | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)

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
    return date.toISOString().split("T")[0]
  }

  const bookNow = async () => {
    const response = await fetch("/api/bookings", {
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
    const data = await response.json()
    setBookingId(data.bookingId)
  }

  useEffect(() => {
    let ws: WebSocket | null = null

    if (bookingId) {
      ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS_URL}/?bookingId=${bookingId}`
      )

      ws.onopen = () => {
        console.log("WebSocket connected")
      }

      ws.onmessage = (event) => {
        console.log(event.data)
      }

      ws.onclose = () => {
        console.log("WebSocket closed")
        //todo: reconnect
      }
    }

    return () => {
      ws?.close()
    }
  }, [bookingId])

  return (
    <div className="grid grid-cols-4 bg-white/30 p-10">
      <DateSelector
        label="Check-in"
        value={formatDate(checkIn)}
        setDate={handleDateChange}
      />
      <DateSelector
        label="Check-out"
        value={formatDate(checkOut)}
        setDate={handleDateChange}
      />
      <NumberOfGuests value={numberOfGuests} setValue={setNumberOfGuests} />
      <div className="w-40 mt-4">
        <button
          onClick={bookNow}
          className="w-full bg-white px-8 py-4 font-semibold uppercase cursor-pointer hover:bg-black hover:text-white"
        >
          Book now
        </button>
      </div>
    </div>
  )
}

export default BookingWidget
