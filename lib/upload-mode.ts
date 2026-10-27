import "server-only";
import { blobEnabled } from "./images";
import { storageMode } from "./storage";

export function uploadMode(): "blob" | "local" | "none" {
  if (blobEnabled) return "blob";
  return storageMode === "local" ? "local" : "none";
}
