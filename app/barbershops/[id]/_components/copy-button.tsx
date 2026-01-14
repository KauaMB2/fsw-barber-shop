"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
}

const CopyButton = ({ text }: CopyButtonProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Telefone copiado com sucesso!");
  };

  return (
    <Button
      variant="outline"
      className="rounded-full hover:cursor-pointer"
      size="sm"
      onClick={handleCopy}
    >
      Copiar
    </Button>
  );
};

export default CopyButton;
