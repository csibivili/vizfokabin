import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  GetCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb"
import { Table } from "sst/node/table"
import { SQSEvent } from "aws-lambda"

import type { Booking } from "../core/types/Booking"
import { sendMessage } from "../core/lib/wsClient"

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

  const getConnection = new GetCommand({
    TableName: Table.Customers.tableName,
    Key: {
      bookingId,
    },
  })
  const getConnectionResult = await db.send(getConnection)
  const connection = getConnectionResult.Item?.connectionId

  const interval = await Promise.all(
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
  if (interval.some((res) => res.Item?.bookingId)) {
    //TODO: checkin and checkout can be done in the same day
    await sendMessage(
      connection,
      JSON.stringify({ error: "Dates are not available" })
    )
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
          "SET bookingId = :bookingId, numberOfGuests = :numberOfGuests, updatedAt = :updatedAt, createdAt = :createdAt, bookingStatus = :bookingStatus",
        ExpressionAttributeValues: {
          ":bookingId": bookingId,
          ":numberOfGuests": numberOfGuests,
          ":updatedAt": new Date().toISOString(),
          ":createdAt": new Date().toISOString(),
          ":bookingStatus": "ongoing",
        },
      })
      return db.send(update)
    })
  )

  await sendMessage(connection, JSON.stringify({ message: "OK" }))
  return { bookingId }
}
