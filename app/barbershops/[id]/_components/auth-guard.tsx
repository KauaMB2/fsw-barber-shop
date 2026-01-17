"use client";

import { LogIn } from "lucide-react";
import { ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const handleLogin = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
    });
    if (error) {
      toast.error(error.message);
    }
  };

  if (isPending) {
    return (
      <div className="rounded-xl border p-4 text-center text-sm text-muted-foreground">
        Verificando sessão...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-dashed p-5 text-center">
        <p className="text-sm font-medium">
          Faça login para agendar um serviço
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Você precisa estar logado para continuar.
        </p>

        <Button
          onClick={handleLogin}
          className="mt-4 gap-2 rounded-full"
        >
          Entrar
          <LogIn className="size-4" />
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
