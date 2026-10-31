import "server-only";
import { cloudinaryEnabled } from "./images";
import { getStorageMode } from "./storage";

export function uploadMode(): "cloudinary" | "local" | "none" {
  if (cloudinaryEnabled) return "cloudinary";
  return getStorageMode() === "local" ? "local" : "none";
}
