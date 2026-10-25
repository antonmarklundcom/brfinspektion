/**
 * HTML för lead-mejl. Allt som användaren har skrivit in ska HTML-escapas
 * innan det hamnar i mejlets HTML, annars kan en anonym avsändare injicera
 * länkar/markup i mejl som skickas från vår egen avsändaradress.
 */

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

/** Ämnesrader får aldrig innehålla radbrytningar (header-injection). */
export function cleanSubject(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function operatorLeadEmailHtml(lead: {
  id: string;
  sourcePath: string;
  kontaktNamn: string;
  epost: string;
  telefon?: string | null;
}, waLink: string | null): string {
  return `<p>Ny lead från ${escapeHtml(lead.sourcePath)}.</p>
      <p>Kontakt: ${escapeHtml(lead.kontaktNamn)}, ${escapeHtml(lead.epost)}${lead.telefon ? `, ${escapeHtml(lead.telefon)}` : ""}</p>
      ${waLink ? `<p><a href="${escapeHtml(waLink)}">Öppna i WhatsApp</a></p>` : ""}
      <p><a href="https://brfinspektion.se/admin/leads/${encodeURIComponent(lead.id)}">Öppna i admin</a></p>`;
}

export function calculatorLeadEmailHtml(
  kontaktNamn: string,
  result: { rangeLowSek: number; rangeHighSek: number; riskBand: string },
): string {
  return `<p>Hej ${escapeHtml(kontaktNamn)},</p>
        <p>Baserat på uppgifterna ni angav är en grov uppskattning
        ${result.rangeLowSek.toLocaleString("sv-SE")}–${result.rangeHighSek.toLocaleString("sv-SE")} SEK.
        Riskbedömning: ${escapeHtml(String(result.riskBand))}.</p>
        <p>Detta är en grov uppskattning, inte en offert. Boka en statusbesiktning för en
        korrekt bedömning: <a href="https://brfinspektion.se/statusbesiktning">brfinspektion.se/statusbesiktning</a></p>`;
}
