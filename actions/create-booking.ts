"use server";

import { isPast } from "date-fns";
import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
});

export const createBooking = protectedActionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { serviceId, date }, ctx: { user } }) => {
    if (isPast(date)) {
      returnValidationErrors(inputSchema, {
        _errors: ["Data e hora selecionadas já passaram."],
      });
    }
    const service = await prisma.barbershopService.findUnique({
      where: {
        id: serviceId,
      },
    });
    // Serviço existe?
    if (!service) {
      returnValidationErrors(inputSchema, {
        _errors: [
          "Serviço não encontrado. Por favor, selecione outro serviço.",
        ],
      });
    }
    const existingBooking = await prisma.booking.findFirst({
      where: {
        barbershopId: service.barbershopId,
        date,
        cancelledAt: null,
      },
    });
    if (existingBooking) {
      returnValidationErrors(inputSchema, {
        _errors: ["Data e hora selecionadas já estão agendadas."],
      });
    }
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        date: date.toISOString(),
        userId: user.id,
        barbershopId: service.barbershopId,
      },
    });
    return booking;
  });
