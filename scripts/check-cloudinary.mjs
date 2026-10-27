// Verifica la firma de Cloudinary (contra los ejemplos oficiales) y el loader de imágenes.
// Uso: node --experimental-strip-types --conditions=react-server scripts/check-cloudinary.mjs
import assert from "node:assert/strict";

const { signParams, publicIdFromUrl } = await import("../lib/cloudinary.ts");
const { default: loader } = await import("../lib/image-loader.ts");

// Ejemplos de https://cloudinary.com/documentation/authentication_signatures
assert.equal(signParams({ timestamp: 1315060510 }, "abcd"), "a21ad0f63beb4de2e5575204b79ab90bffb02c10");
assert.equal(
  signParams(
    { timestamp: 1315060510, public_id: "sample_image", eager: "w_400,h_300,c_pad|w_260,h_200,c_crop" },
    "abcd",
  ),
  "bfd09f95f331f558cbd1320e67aa8d488770583e",
);
console.log("✔ firma igual a los ejemplos oficiales de Cloudinary");

assert.equal(
  publicIdFromUrl("https://res.cloudinary.com/demo/image/upload/v1730000000/h3/autos/abc_x1.webp"),
  "h3/autos/abc_x1",
);
console.log("✔ public_id a partir de la URL");

const photo = "https://res.cloudinary.com/demo/image/upload/v1/h3/autos/a.webp";
assert.equal(
  loader({ src: photo, width: 640, quality: 70 }),
  "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:eco,c_limit,w_640/v1/h3/autos/a.webp",
);
assert.equal(
  loader({ src: "https://cdn.shopify.com/s/files/x.jpg?v=1&width=1600", width: 828 }),
  "https://cdn.shopify.com/s/files/x.jpg?v=1&width=828",
);
assert.equal(loader({ src: "/brand/mark.png", width: 96 }), "/brand/mark.png?w=96");
console.log("✔ loader de imágenes (Cloudinary, Shopify y archivos locales)");
