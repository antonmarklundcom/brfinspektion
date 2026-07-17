import { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guider";

const SITE_URL = "https://brfinspektion.se";

const STATIC_PATHS = [
  "/",
  "/stambyte",
  "/stambyte/kostnad",
  "/stambyte/behovsbedomning",
  "/kostnadskalkyl",
  "/statusbesiktning",
  "/kontrollansvarig",
  "/entreprenadbesiktning",
  "/garantibesiktning",
  "/ovk-besiktning",
  "/upphandling",
  "/underhallsplan",
  "/guider",
  "/om-oss",
  "/kontakt",
  "/integritetspolicy",
  "/villkor",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const guideEntries = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guider/${guide.slug}`,
    lastModified: new Date(guide.publishedAt),
  }));

  return [...staticEntries, ...guideEntries];
}
