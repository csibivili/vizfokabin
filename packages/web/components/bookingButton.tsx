"use client"

import Link from "next/link"

import Button from "./button"

const BookingButton = () => {
  const link = "https://www.booking.com/hotel/hu/vizfo-kabin.hu.html"
  return (
    <Link href={link} target="_blank">
      <Button color="booking">
        <span>Foglalj Booking-on</span>
      </Button>
    </Link>
  )
}

export default BookingButton
