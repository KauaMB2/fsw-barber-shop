import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { formatCurrency } from "@/lib/utils";

import { Card, CardContent } from "./ui/card";

interface BookingSummaryProps {
  serviceName: string;
  servicePrice: number;
  barbershopName: string;
  date: Date;
  time?: string;
}

const BookingSummary = ({
  serviceName,
  servicePrice,
  barbershopName,
  date,
  time,
}: BookingSummaryProps) => {
  // Adiciona 3 horas para corrigir o fuso horário
  const localDate = new Date(date);
  localDate.setHours(localDate.getHours() + 3);
  
  const formattedTime = time ?? format(localDate, "HH:mm");
  
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-bold">{serviceName}</p>
          <p className="text-sm font-bold">{formatCurrency(servicePrice)}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Data</p>
          <p className="text-sm">
            {format(localDate, "d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Horário</p>
          <p className="text-sm">{formattedTime}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Barbearia</p>
          <p className="text-sm">{barbershopName}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;