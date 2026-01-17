"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { BotMessageSquare, ChevronLeft, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const ChatPage = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  // Sessão do usuário
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const [input, setInput] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // não enviar se não estiver logado ou se não houver texto
    if (!isLoggedIn) {
      // opcional: abrir fluxo de login aqui
      return;
    }
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleLogin = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    // após login, a sessão será atualizada automaticamente pelo hook useSession
  };

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant") {
      const allText = lastMessage.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");

      const checkoutUrlMatch = allText.match(/\[CHECKOUT_URL:(.*?)\]/);
      if (checkoutUrlMatch) {
        const checkoutUrl = checkoutUrlMatch[1];
        setTimeout(() => {
          window.location.href = checkoutUrl;
        }, 1500);
      }
    }
  }, [messages]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-5 pt-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="size-6 hover:cursor-pointer">
            <ChevronLeft className="size-6" />
          </Button>
        </Link>
        <h1 className="font-(family-name:var(--font-merriweather)) text-xl tracking-tight italic">
          Agenda.ai
        </h1>
        <div className="size-6" />
      </header>

      <div className="px-5 pt-6">
        <div className="rounded-xl border p-3">
          <p className="text-muted-foreground text-center text-sm">
            Seu assistente de agendamentos está online.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="flex gap-2 px-3 pt-6 pr-14">
          <div className="bg-primary/12 flex size-8 shrink-0 items-center justify-center rounded-full border">
            <BotMessageSquare className="text-primary size-3.5" />
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            Olá! Sou o{" "}
            <span className="font-(family-name:--font-merriweather) tracking-tight italic">
              Agenda.ai
            </span>
            , seu assistente pessoal.
            {"\n\n"}
            Estou aqui para te auxiliar a agendar seu corte ou barba, encontrar
            as barbearias disponíveis perto de você e responder às suas dúvidas.
          </p>
        </div>

        {messages.map((message) => (
          <div key={message.id} className="pt-6">
            {message.role === "assistant" ? (
              <div className="flex items-start gap-2 px-3 pr-14">
                <div className="bg-primary/12 flex size-8 shrink-0 items-center justify-center rounded-full border">
                  <BotMessageSquare className="text-primary size-3.5" />
                </div>
                <div className="prose prose-sm max-w-none text-sm leading-relaxed">
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <Streamdown key={index}>
                        {part.text.replace(/\[CHECKOUT_URL:.*?\]/g, "")}
                      </Streamdown>
                    ) : null,
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-end pr-5 pl-10">
                <div className="bg-secondary rounded-full px-4 py-3">
                  <p className="text-sm">
                    {message.parts.map((part, index) =>
                      part.type === "text" ? (
                        <span key={index}>{part.text}</span>
                      ) : null,
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2 px-3 pt-6 pr-14">
            <div className="bg-primary/12 flex size-8 shrink-0 items-center justify-center rounded-full border">
              <BotMessageSquare className="text-primary size-3.5" />
            </div>
            <div className="text-muted-foreground text-sm">Digitando...</div>
          </div>
        )}
      </div>

      {/* fixed input area */}
      <div className="bg-muted fixed right-0 bottom-0 left-0 p-5">
        {/* Se não estiver logado: mostrar banner com CTA de login e bloquear input */}
        {!isLoggedIn ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Você não está logado.</p>
              <p className="text-xs text-muted-foreground">
                Faça login para começar a conversar com o assistente.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleLogin} className="rounded-full hover:cursor-pointer">
                Entrar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem"
              disabled={isLoading}
              className="bg-background text-foreground placeholder:text-muted-foreground flex-1 rounded-full px-4 py-3 text-sm border-border"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="size-10.5 shrink-0 rounded-full hover:cursor-pointer"
            >
              <Send className="size-5" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
