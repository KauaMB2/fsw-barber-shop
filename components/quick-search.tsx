"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent,useState } from "react";

import { categories, categoryIcons } from "@/lib/utils";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PageSectionScroller } from "./ui/page";

const QuickSearch = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchValue.trim()) return;
    router.push(`/barbershops?search=${encodeURIComponent(searchValue.trim())}`);
  };

  return (
    <>
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Input
          className="border-border rounded-full"
          placeholder="Pesquisar"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button type="submit" className="h-10 w-10 rounded-full hover:cursor-pointer">
          <SearchIcon />
        </Button>
      </form>
      <PageSectionScroller>
        {categories.map((category) => {
          const Icon = categoryIcons[category.search];

          return (
            <Link
              key={category.search}
              href={`/barbershops?search=${category.search}`}
              className="border-border bg-card-background flex shrink-0 items-center justify-center gap-3 rounded-3xl border px-4 py-2 hover:bg-gray-200 transition"
            >
              {Icon && <Icon className="size-4" />}
              <span className="text-card-foreground text-sm font-medium">
                {category.label}
              </span>
            </Link>
          );
        })}
      </PageSectionScroller>
    </>
  );
};

export default QuickSearch;
