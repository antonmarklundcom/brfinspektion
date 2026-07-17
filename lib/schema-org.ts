const SITE_URL = "https://brfinspektion.se";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BRF Inspektion",
    url: SITE_URL,
    areaServed: "SE",
    // TODO-ORG (plan.md D9): logo URL and contactPoint details pending
    // operator-supplied assets and org.nr.
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BRF Inspektion",
    url: SITE_URL,
  };
}

export interface ServiceSchemaInput {
  name: string;
  description: string;
  serviceType: string;
  url: string;
}

export function serviceSchema({ name, description, serviceType, url }: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    areaServed: "SE",
    url: `${SITE_URL}${url}`,
    provider: {
      "@type": "Organization",
      name: "BRF Inspektion",
      url: SITE_URL,
    },
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

// Rule (architecture.md §6.3): JSON-LD must mirror visible page content
// exactly. Always build this from the same `faq` array the page renders
// visibly — never emit schema for content not shown on the page.
export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}

export function articleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}${url}`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: "BRF Inspektion",
    },
  };
}
