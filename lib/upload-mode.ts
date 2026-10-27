import "server-only";
import { cloudinaryEnabled } from "./images";
import { storageMode } from "./storage";

export function uploadMode(): "cloudinary" | "local" | "none" {
  if (cloudinaryEnabled) return "cloudinary";
  return storageMode === "local" ? "local" : "none";
}
