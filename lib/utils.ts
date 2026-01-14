import { type ClassValue,clsx } from "clsx"
import { Eye, Footprints, Scissors, Sparkles, User, Waves } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

export const categories = [
  { label: "Cabelo", search: "cabelo" },
  { label: "Barba", search: "barba" },
  { label: "Acabamento", search: "acabamento" },
  { label: "Sobrancelha", search: "sobrancelha" },
  { label: "Massagem", search: "massagem" },
  { label: "Hidratacao", search: "hidratacao" },
];

export const categoryIcons: Record<string, React.ElementType> = {
  cabelo: Scissors,
  barba: User,
  acabamento: Sparkles,
  sobrancelha: Eye,
  pézinho: Footprints,
  progressiva: Waves,
};