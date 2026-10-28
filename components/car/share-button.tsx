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
    try {
      // Copiar solo existe con https (o localhost); en otros casos se comparte por WhatsApp
      if (!navigator.clipboard) throw new Error("sin portapapeles");
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Mira este ${title} en H3 Seminuevos: ${url}`)}`, "_blank", "noopener");
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-line bg-soft px-2 text-sm font-semibold transition-all hover:border-fg/30 active:scale-95 ${className}`}
    >
      {copied ? <Check className="size-4 text-wa-dark" /> : <Share2 className="size-4 text-brand-hi" />}
      {copied ? "¡Copiado!" : "Compartir"}
    </button>
  );
}
