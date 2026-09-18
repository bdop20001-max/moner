import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.monermanush.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/profiles", "/membership", "/security", "/contact", "/login"];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
