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
  {
    slug: "vad-kostar-ett-stambyte-sa-raknar-ni",
    title: "Vad kostar ett stambyte? Så räknar ni",
    description:
      "Metoden bakom en kostnadsuppskattning för stambyte — vilka faktorer som väger tyngst och hur ni kommer fram till en realistisk siffra för er förening.",
    publishedAt: "2026-07-18",
    body: [
      "Det finns inget enhetligt pris per lägenhet för stambyte, eftersom kostnaden styrs av flera faktorer som ser olika ut i varje fastighet. Att förstå vilka faktorer som väger tyngst hjälper styrelsen att tolka en uppskattning rätt — och att ställa rätt frågor till den som gör den.",
      "Byggår och typ av stammar är de två faktorer som påverkar mest. Äldre fastigheter med gjutjärnsstammar har ofta mer omfattande arbete framför sig än fastigheter med nyare material, eftersom omkringliggande installationer (el, ventilation, våtrumsytskikt) ofta behöver rivas och återställas i samma veva.",
      "Antalet lägenheter avgör den totala kostnaden mer än kostnaden per lägenhet, men stordriftsfördelar kan göra att kostnaden per lägenhet blir något lägre i större föreningar. Tillgänglighet i fastigheten (t.ex. souterrängvåningar, komplicerad stamdragning) kan däremot driva upp kostnaden per lägenhet oavsett storlek.",
      "Metoden — traditionellt stambyte eller relining — påverkar också bilden, men vilken metod som är lämplig avgörs bäst genom en statusbesiktning av fastighetens specifika förutsättningar, inte genom en generell tumregel.",
      "Den mest tillförlitliga vägen till en realistisk siffra för er förening är att kombinera en grov digital uppskattning med en statusbesiktning som tar hänsyn till fastighetens faktiska skick.",
    ],
    faq: [
      {
        question: "Varför skiljer sig kostnadsuppskattningar så mycket mellan olika källor?",
        answer:
          "Uppskattningar som inte tar hänsyn till fastighetens specifika byggår, stamtyp och omfattning blir grova per nödvändighet. Ju mer specifik informationen är, desto smalare kan intervallet göras.",
      },
      {
        question: "Kan vi få en kostnadsindikation utan att anlita någon?",
        answer:
          "Ja, vår kostnadskalkyl ger en kostnadsfri grov uppskattning baserat på grunduppgifter om föreningen. Den ersätter inte en statusbesiktning, men ger styrelsen ett första underlag.",
      },
    ],
  },
  {
    slug: "stambyte-eller-relining",
    title: "Stambyte eller relining — hur vet styrelsen vad som krävs?",
    description:
      "Skillnaden mellan traditionellt stambyte och relining, och varför valet av metod bör avgöras genom en statusbesiktning snarare än en generell regel.",
    publishedAt: "2026-07-18",
    body: [
      "Traditionellt stambyte innebär att de gamla rören bryts ut och ersätts med nya, vilket oftast kräver ingrepp i väggar och golv i badrum och kök. Relining innebär istället att insidan av befintliga rör beläggs med ett nytt skikt, utan att rören behöver bytas ut fysiskt.",
      "Vilken metod som är lämplig beror på rörens skick, material och den befintliga installationens ålder och omfattning av skador. Rör med omfattande korrosion, felaktig dragning eller andra strukturella problem kan vara olämpliga att relina, medan rör i bättre skick kan vara goda kandidater.",
      "Det finns inte en generell regel för vilken metod som är rätt — det är en bedömning som kräver att någon faktiskt undersöker fastighetens stammar. Det är precis det en statusbesiktning gör: den ger styrelsen ett konkret underlag istället för en gissning baserad på fastighetens ålder allena.",
      "Styrelsens uppgift är inte att själva avgöra vilken metod som krävs, utan att se till att rätt utredning görs innan beslut fattas och pengar avsätts.",
    ],
    faq: [
      {
        question: "Är relining alltid billigare än stambyte?",
        answer:
          "Inte nödvändigtvis, och det beror på rörens skick och omfattningen av arbetet. En rättvisande jämförelse för er fastighet kräver en bedömning av en sakkunnig, inte en generell siffra.",
      },
      {
        question: "Kan vi relina om stammarna redan har stora skador?",
        answer:
          "Det beror på skadornas omfattning och typ. En statusbesiktning avgör om relining är en lämplig lösning eller om ett traditionellt stambyte krävs.",
      },
      {
        question: "Vem avgör vilken metod som ska användas?",
        answer:
          "Beslutet fattas av styrelsen, men bör grunda sig på en statusbesiktning som ger en teknisk bedömning av fastighetens specifika förutsättningar.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
