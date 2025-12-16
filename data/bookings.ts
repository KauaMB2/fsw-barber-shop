import { headers } from "next/headers";

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { barbershop: true; service: true };
}>;

export const getUserBookings = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return { confirmedBookings: [], finishedBookings: [] };
  }
  const now = new Date();
  const [confirmedBookings, finishedBookings] = await Promise.all([
    prisma.booking.findMany({
      where: {
        userId: session.user.id,
        date: { gte: now },
        cancelledAt: null,
      },
      include: {
        barbershop: true,
        service: true,
      },
      orderBy: { date: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        userId: session.user.id,
        OR: [{ date: { lt: now } }, { cancelledAt: { not: null } }],
      },
      include: {
        barbershop: true,
        service: true,
      },
      orderBy: { date: "desc" },
    }),
  ]);
  return { confirmedBookings, finishedBookings };
};
