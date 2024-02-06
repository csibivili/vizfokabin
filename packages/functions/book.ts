import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  GetCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb"
import { Table } from "sst/node/table"
import { SQSEvent } from "aws-lambda"

import type { Booking } from "../core/types/Booking"

const toTableKeys = (date: string): [string, number] => {
  const [year, month, day] = date.split("-")
  return [`${year}_${month}`, Number(day)]
}

const getDatesBetweenDates = (startDate: Date, endDate: Date): string[] => {
  let dates: string[] = []
  let currentDate: Date = startDate

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

export const handler = async (event: SQSEvent) => {
  const [{ body }] = event.Records
  // TODO: add valibot
  const { checkIn, checkOut, numberOfGuests, bookingId } = JSON.parse(
    body
  ) as Booking
  const dates = getDatesBetweenDates(new Date(checkIn), new Date(checkOut))

  const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

  const available = await Promise.all(
    dates.map((date) => {
      const [year_month, day] = toTableKeys(date)
      const get = new GetCommand({
        TableName: Table.Bookings.tableName,
        Key: {
          year_month,
          day,
        },
      })
      return db.send(get)
    })
  )
  if (available.some((res) => res.Item?.bookingId)) {
    return
  }
  
  await Promise.all(
    dates.map((date) => {
      const [year_month, day] = toTableKeys(date)
      const update = new UpdateCommand({
        TableName: Table.Bookings.tableName,
        Key: {
          year_month,
          day,
        },
        UpdateExpression:
          "SET bookingId = :id, numberOfGuests = :numberOfGuests, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":id": bookingId,
          ":numberOfGuests": numberOfGuests,
          ":updatedAt": new Date().toISOString(),
        },
      })
      return db.send(update)
    })
  )

  return { bookingId }
}
