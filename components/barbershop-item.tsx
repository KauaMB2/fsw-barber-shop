import Image from "next/image";

import { Barbershop } from "@/generated/prisma/client";

interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <div className="relative min-h-50 min-w-50 rounded-xl">
      <div className="tap-0 bg-linear-tot absolute left-0 z-10 h-full w-full rounded-lg from-black to-transparent">
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          fill
          className="rounded-xl object-cover"
        />
        <div className="absolute right-0 bottom-0 left-0 z-20 p-4">
          <h3 className="text-background text-lg font-bold">
            {barbershop.name}
          </h3>
          <p className="text-background text-xs">{barbershop.address}</p>
        </div>
      </div>
    </div>
  );
};

export default BarbershopItem;
