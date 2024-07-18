"use client"

import Link from "next/link"

import Button from "./button"

const AirbnbButton = () => {
  const link = "https://airbnb.hu/h/vizfokabin"
  return (
    <Link href={link} target="_blank">
      <Button color="airbnb">
        <span>Foglalj Airbnb-n</span>
      </Button>
    </Link>
  )
}

export default AirbnbButton
