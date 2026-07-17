import { Metadata } from "next";

const SITE_URL = "https://brfinspektion.se";
const SITE_NAME = "BRF Inspektion";

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
}

export function buildMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const canonical = `${SITE_URL}${path}`;
  return {
    // Root layout's title.template already appends " | BRF Inspektion".
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "sv_SE",
      type: "website",
    },
  };
}
