import type { MetadataRoute } from "next";
import { getAllCars } from "@/lib/data";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await getAllCars();
  return [
    { url: site.url, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/autos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/vende-tu-auto`, changeFrequency: "monthly", priority: 0.7 },
    ...cars.map((c) => ({
      url: `${site.url}/autos/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: c.status === "vendido" ? 0.3 : 0.8,
      images: c.images.slice(0, 1),
    })),
  ];
}
