import "server-only";
import { createHash } from "node:crypto";

// Fotos en Cloudinary (plan gratuito). Configura CLOUDINARY_URL
// (cloudinary://API_KEY:API_SECRET@CLOUD_NAME) o las tres variables sueltas.

type Config = { cloudName: string; apiKey: string; apiSecret: string };

function readConfig(): Config | null {
  const url = process.env.CLOUDINARY_URL;
  if (url) {
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (m) return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    return { cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, apiSecret: CLOUDINARY_API_SECRET };
  }
  return null;
}

const config = readConfig();

export const cloudinaryEnabled = Boolean(config);

// Carpeta y límite de tamaño con el que se guardan las fotos (la original nunca pasa de 1600 px)
export const UPLOAD_FOLDER = "h3/autos";
export const UPLOAD_TRANSFORMATION = "c_limit,h_1600,w_1600";

// Firma de Cloudinary: parámetros ordenados "a=1&b=2" + API secret, en SHA-1
export function signParams(params: Record<string, string | number>, apiSecret: string) {
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== "" && params[k] != null)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

// Datos para que el navegador del administrador suba una foto directo a Cloudinary
export function signedUploadParams() {
  if (!config) throw new Error("Cloudinary no está configurado");
  const params = {
    folder: UPLOAD_FOLDER,
    timestamp: Math.floor(Date.now() / 1000),
    transformation: UPLOAD_TRANSFORMATION,
  };
  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    ...params,
    signature: signParams(params, config.apiSecret),
  };
}

export function isOwnCloudinaryUrl(url: string) {
  if (!config) return false;
  return url.startsWith(`https://res.cloudinary.com/${config.cloudName}/image/upload/`);
}

export function publicIdFromUrl(url: string) {
  const rest = url.split("/image/upload/")[1];
  if (!rest) return null;
  return rest.replace(/^v\d+\//, "").replace(/\.[a-z0-9]+$/i, "");
}

// Sube una imagen que ya está en internet (ej. las fotos de Shopify) sin descargarla aquí
export async function uploadFromUrl(sourceUrl: string) {
  if (!config) throw new Error("Cloudinary no está configurado");
  const params = {
    folder: UPLOAD_FOLDER,
    timestamp: Math.floor(Date.now() / 1000),
    transformation: UPLOAD_TRANSFORMATION,
  };
  const body = new URLSearchParams({
    file: sourceUrl,
    api_key: config.apiKey,
    signature: signParams(params, config.apiSecret),
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const json = (await res.json()) as { secure_url?: string; error?: { message: string } };
  if (!res.ok || !json.secure_url) throw new Error(json.error?.message ?? "Cloudinary no aceptó la foto");
  return json.secure_url;
}

export async function destroyByUrls(urls: string[]) {
  if (!config) return;
  const cfg = config;
  const ids = urls.filter(isOwnCloudinaryUrl).map(publicIdFromUrl).filter((x): x is string => Boolean(x));
  await Promise.all(
    ids.map(async (public_id) => {
      const params = { public_id, timestamp: Math.floor(Date.now() / 1000) };
      const body = new URLSearchParams({
        public_id,
        timestamp: String(params.timestamp),
        api_key: cfg.apiKey,
        signature: signParams(params, cfg.apiSecret),
      });
      await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/destroy`, { method: "POST", body }).catch(
        () => {},
      );
    }),
  );
}
