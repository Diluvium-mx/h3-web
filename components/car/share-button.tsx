"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({ title, url, className = "" }: { title: string; url: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Mira este ${title} en H3 Seminuevos`, url });
        return;
      } catch {
        return; // el usuario canceló
      }
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-medium transition-all hover:border-fg/30 active:scale-95 ${className}`}
    >
      {copied ? <Check className="size-4 text-wa-dark" /> : <Share2 className="size-4" />}
      {copied ? "¡Enlace copiado!" : "Compartir"}
    </button>
  );
}
