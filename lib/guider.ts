import { FaqItem } from "@/lib/schema-org";

// Guide content lives here as structured data for now. architecture.md §2
// specifies MDX under content/guider/*.mdx as the intended long-term format
// (needed once guide volume grows past a handful) — this data-driven
// version covers the Phase 1 priority-1 guide (strategy.md §5.3) without
// adding the @next/mdx dependency before it's needed.

export interface Guide {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  body: string[];
  faq?: FaqItem[];
}

export const GUIDES: Guide[] = [
  {
    slug: "underhallsplan-for-brf",
    title: "Underhållsplan för brf — komplett guide",
    description:
      "Vad en underhållsplan är, varför även en liten förening behöver en, och hur stambyte hör ihop med planen.",
    publishedAt: "2026-07-17",
    body: [
      "En underhållsplan är en långsiktig sammanställning av föreningens kommande underhållsbehov och de kostnader de för med sig. Utan en aktuell plan riskerar styrelsen att fatta beslut om avgiftsnivå utan att veta vad som väntar — som ett stambyte om tio år.",
      "Även små föreningar behöver en underhållsplan. Behovet av framförhållning är detsamma oavsett antal lägenheter, även om omfattningen av planen kan vara enklare.",
      "Stambyte är typiskt den enskilt största posten i en underhållsplan för äldre fastigheter. Att identifiera ungefärlig tidpunkt och kostnadsintervall i god tid gör det möjligt att bygga upp fonden för yttre underhåll innan projektet blir akut.",
    ],
    faq: [
      {
        question: "Måste alla bostadsrättsföreningar ha en underhållsplan?",
        answer:
          "Det finns inget generellt lagkrav på en formell underhållsplan, men styrelsens ansvar för fastighetens skötsel enligt bostadsrättslagen gör den i praktiken nödvändig för ansvarsfull förvaltning.",
      },
      {
        question: "Hur ofta bör underhållsplanen uppdateras?",
        answer:
          "En vanlig praxis är att se över planen vart tredje till femte år, eller efter större genomförda åtgärder som ett stambyte.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
