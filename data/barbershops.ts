import { prisma } from "@/lib/prisma"

export const getBarbershops = async () => {
    try{
        const barbershops = await prisma.barbershop.findMany();
        return barbershops;
    } catch(error){
        console.error(error);
        return [];
    }
}

export const getPopularBarbershops = async () => {
    try{
        const popularBarbershops = await prisma.barbershop.findMany({
            orderBy: {
                name: "desc"
            }
        });
        return popularBarbershops;
    } catch(error){
        console.error(error);
        return [];
    }
}