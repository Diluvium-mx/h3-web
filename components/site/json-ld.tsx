import { carTitle, carUrl, type Car } from "@/lib/cars";
import { site } from "@/lib/site";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escapa "<" para evitar inyección de HTML dentro del script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoDealer",
        name: site.name,
        description: site.description,
        url: site.url,
        image: `${site.url}/opengraph-image.jpg`,
        logo: `${site.url}/brand/logo-dark.png`,
        telephone: "+52 993 246 7572",
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.address.street}, ${site.address.neighborhood}`,
          postalCode: site.address.postalCode,
          addressLocality: site.address.city,
          addressRegion: site.address.state,
          addressCountry: site.address.country,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: site.openingHours.days,
          opens: site.openingHours.opens,
          closes: site.openingHours.closes,
        },
        areaServed: { "@type": "City", name: `${site.address.city}, ${site.address.state}` },
        sameAs: Object.values(site.socials),
      }}
    />
  );
}

// Migas de pan para Google: Inicio › Catálogo › auto
export function BreadcrumbJsonLd({ car }: { car: Car }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
          { "@type": "ListItem", position: 2, name: "Catálogo", item: `${site.url}/autos` },
          { "@type": "ListItem", position: 3, name: carTitle(car), item: carUrl(car) },
        ],
      }}
    />
  );
}

export function CarJsonLd({ car }: { car: Car }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Car",
        name: carTitle(car),
        brand: { "@type": "Brand", name: car.brand },
        model: car.model,
        vehicleModelDate: String(car.year),
        bodyType: car.body,
        ...(car.mileage != null && {
          mileageFromOdometer: { "@type": "QuantitativeValue", value: car.mileage, unitCode: "KMT" },
        }),
        ...(car.transmission && { vehicleTransmission: car.transmission }),
        ...(car.fuel && { fuelType: car.fuel }),
        ...(car.color && { color: car.color }),
        ...(car.engine && { vehicleEngine: { "@type": "EngineSpecification", name: car.engine } }),
        itemCondition: "https://schema.org/UsedCondition",
        image: car.images.slice(0, 6),
        description: car.description.slice(0, 500),
        url: carUrl(car),
        offers: {
          "@type": "Offer",
          price: car.price,
          priceCurrency: "MXN",
          availability:
            car.status === "vendido"
              ? "https://schema.org/SoldOut"
              : car.status === "apartado"
                ? "https://schema.org/LimitedAvailability"
                : "https://schema.org/InStock",
          seller: { "@type": "AutoDealer", name: site.name },
          areaServed: site.address.city,
        },
      }}
    />
  );
}
