import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  GetCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb"
import { Table } from "sst/node/table"
import { v4 as uuid } from "uuid"

import { LambdaHandlerProps } from "../core/invokeLambda"
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

export const handler = async (event: LambdaHandlerProps<Booking>) => {
  const { checkIn, checkOut, numberOfGuests } = event.body
  const dates = getDatesBetweenDates(new Date(checkIn), new Date(checkOut))

  const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

  const book = () => new Promise(async (resolve, reject) => {
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
      reject({ error: "Dates are not available", status: 400 })
    }
    const id = uuid()
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
            "SET bookingId = :id, numberOfGuests = :numberOfGuests",
          ExpressionAttributeValues: {
            ":id": id,
            ":numberOfGuests": numberOfGuests,
          },
        })
        return db.send(update)
      })
    )
    resolve({ bookingId: id, status: 200 })
  })

  try {
    // TODO: promise should be added to a queue
    return await book()
  } catch (error) {
    return error
  }
}
