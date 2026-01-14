import Image from "next/image";

import BarbershopItem from "@/components/barbershop-item";
import BookingItem from "@/components/booking-item";
import Footer from "@/components/footer";
import Header from "@/components/header";
import QuickSearch from "@/components/quick-search";
import {
  PageContainer,
  PageSectionContent,
  PageSectionScroller,
  PageSectionTitle,
} from "@/components/ui/page";
import { getBarbershops, getPopularBarbershops } from "@/data/barbershops";
import { getUserBookings } from "@/data/bookings";
import banner from "@/public/banner.png";

export default async function Home() {
  const barbershops = await getBarbershops();
  const popularBarbershops = await getPopularBarbershops();
  const { confirmedBookings } = await getUserBookings();

  return (
    <div>
      <Header />
      <PageContainer>
        <QuickSearch />
        <Image
          src={banner}
          alt="Agende nos melhores com a Aparatus"
          sizes="100vw"
          className="h-auto w-full lg:hidden"
        />
        {confirmedBookings.length > 0 && (
          <PageSectionContent>
            <PageSectionTitle>Agendamentos</PageSectionTitle>
            <PageSectionScroller>
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </PageSectionScroller>
          </PageSectionContent>
        )}
        <PageSectionContent>
          <PageSectionTitle>Barbearias</PageSectionTitle>
          <PageSectionScroller>
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSectionContent>
        <PageSectionContent>
          <PageSectionTitle>Barbearias populares</PageSectionTitle>
          <PageSectionScroller>
            {popularBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSectionContent>
      </PageContainer>
      <Footer />
    </div>
  );
}
