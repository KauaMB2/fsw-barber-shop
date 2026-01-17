"use client";

import { loadStripe } from "@stripe/stripe-js";
import { ptBR } from "date-fns/locale";
import { Loader2, LogIn } from "lucide-react";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { createBookingCheckoutSession } from "@/actions/create-booking-checkout-session";
import { Barbershop, BarbershopService } from "@/generated/prisma/client";
import { useGetDateAvailableTimeSlots } from "@/hooks/data/use-get-date-availabe-time-slots";
import { authClient } from "@/lib/auth-client";
import { envClient } from "@/lib/env-client";
import { formatCurrency } from "@/lib/utils";

import BookingSummary from "./booking-summary";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface ServiceItemProps {
  service: BarbershopService;
  barbershop: Barbershop;
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  );
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const { executeAsync: executeCreateBooking, isPending: isCreatingBooking } =
    useAction(createBookingCheckoutSession);
  const { data: availableTimeSlots } = useGetDateAvailableTimeSlots({
    barbershopId: barbershop.id,
    date: selectedDate,
  });
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }
    const splittedTime = selectedTime.split(":");
    const hours = Number(splittedTime[0]);
    const minutes = Number(splittedTime[1]);
    const date = new Date(selectedDate);
    date.setHours(hours, minutes);
    const result = await executeCreateBooking({
      date,
      serviceId: service.id,
    });
    if (result.validationErrors) {
      return toast.error(result.validationErrors._errors?.[0]);
    }
    if (result.serverError) {
      return toast.error(
        "Erro ao criar agendamento. Por favor, tente novamente.",
      );
    }
    const checkoutSession = result.data;
    if (!checkoutSession) {
      return toast.error(
        "Erro ao criar agendamento. Por favor, tente novamente.",
      );
    }
    if (!envClient.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      return toast.error(
        "Erro ao criar agendamento. Por favor, tente novamente.",
      );
    }
    const stripe = await loadStripe(
      envClient.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    );
    if (!stripe) {
      return toast.error(
        "Erro ao criar agendamento. Por favor, tente novamente.",
      );
    }
    await stripe.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
    setSheetIsOpen(false);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  const handleLogin = async () => {
    const { error } = await authClient.signIn.social({ provider: "google" });
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="border-border bg-card flex gap-3 rounded-2xl border p-3">
      <div className="relative h-27.5 w-27.5 shrink-0">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold">{service.name}</p>
          <p className="text-muted-foreground text-sm">{service.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">
            {formatCurrency(service.priceInCents)}
          </p>
          <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-full hover:cursor-pointer" size="sm">
                Reservar
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto px-0 pb-0">
              <SheetHeader className="border-border border-b px-5 py-6">
                <SheetTitle>Fazer Reserva</SheetTitle>
              </SheetHeader>
              {sessionLoading ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Verificando sessão...
                </div>
              ) : null}
              {!session?.user && !sessionLoading ? (
                <div className="px-5 py-6">
                  <p className="text-sm font-medium">
                    Você precisa estar logado para fazer uma reserva.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Faça login para continuar.
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleLogin}
                      className="flex-1 gap-2 rounded-full hover:cursor-pointer"
                    >
                      <LogIn className="size-4" />
                      Entrar
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setSheetIsOpen(false)}
                      className="rounded-full hover:cursor-pointer"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              ) : null}
              {session?.user && (
                <>
                  <div className="border-border border-b px-5 py-6">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      locale={ptBR}
                      className="w-full p-0"
                      disabled={{ before: new Date() }}
                      classNames={{
                        cell: "w-full",
                        day: "w-[36px] h-[36px] mx-auto text-sm bg-transparent hover:bg-muted rounded-full data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
                        head_cell:
                          "w-full text-xs font-normal text-muted-foreground capitalize",
                        caption: "capitalize",
                        caption_label: "text-base font-bold",
                        nav: "flex gap-1 absolute right-0 top-0 z-10",
                        nav_button_previous:
                          "w-7 h-7 bg-transparent border border-border rounded-lg hover:opacity-100 hover:bg-transparent",
                        nav_button_next:
                          "w-7 h-7 bg-muted text-muted-foreground rounded-lg hover:opacity-100 hover:bg-muted",
                        month_caption:
                          "flex justify-start pt-1 relative items-center w-full px-0",
                      }}
                    />
                  </div>
                  {selectedDate && (
                    <div className="border-border flex gap-3 overflow-y-hidden overflow-x-auto border-b px-5 ">
                      {availableTimeSlots?.data?.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className="rounded-full hover:cursor-pointer"
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}
                  {selectedDate && selectedTime && (
                    <div className="px-5 py-6">
                      <BookingSummary
                        serviceName={service.name}
                        servicePrice={service.priceInCents}
                        barbershopName={barbershop.name}
                        date={selectedDate}
                        time={selectedTime}
                      />
                    </div>
                  )}
                  <SheetFooter className="px-5 pb-6">
                    <Button
                      className="w-full hover:cursor-pointer"
                      disabled={!selectedDate || !selectedTime || isCreatingBooking}
                      onClick={handleConfirmBooking}
                    >
                      {isCreatingBooking ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Confirmar"
                      )}
                    </Button>
                  </SheetFooter>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;
