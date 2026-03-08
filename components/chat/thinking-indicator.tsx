"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function ThinkingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 shrink-0 border">
        <AvatarFallback>
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1 rounded-lg bg-muted px-4 py-3">
        <span className="h-2 w-2 animate-[bounce_1.4s_ease-in-out_infinite] rounded-full bg-muted-foreground/60" />
        <span className="h-2 w-2 animate-[bounce_1.4s_ease-in-out_0.2s_infinite] rounded-full bg-muted-foreground/60" />
        <span className="h-2 w-2 animate-[bounce_1.4s_ease-in-out_0.4s_infinite] rounded-full bg-muted-foreground/60" />
      </div>
    </div>
  );
}
