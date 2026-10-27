import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="inline-flex items-center gap-2 text-sm text-mute hover:text-fg">
        <LogOut className="size-4" /> Cerrar sesión
      </button>
    </form>
  );
}
