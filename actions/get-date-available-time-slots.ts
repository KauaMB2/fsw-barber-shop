"use server";

import { endOfDay, format, startOfDay } from "date-fns";
import { z } from "zod";

import { actionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  barbershopId: z.uuid(),
  date: z.date(),
});

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barbershopId, date } }) => {
    const bookings = await prisma.booking.findMany({
      where: {
        barbershopId,
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        cancelledAt: null,
      },
    });
    const occupiedSlots = bookings.map((booking) =>
      format(booking.date, "HH:mm"),
    );
    const availableTimeSlots = TIME_SLOTS.filter(
      (slot) => !occupiedSlots.includes(slot),
    );
    return availableTimeSlots;
  });
