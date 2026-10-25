import { describe, expect, it } from "vitest";
import {
  calculatorLeadEmailHtml,
  cleanSubject,
  escapeHtml,
  operatorLeadEmailHtml,
} from "@/lib/lead-email";

const evil = `<a href="https://evil.example">klicka</a>"'&`;

describe("lead-email escaping", () => {
  it("escapeHtml neutralizes markup", () => {
    expect(escapeHtml(evil)).toBe(
      "&lt;a href=&quot;https://evil.example&quot;&gt;klicka&lt;/a&gt;&quot;&#39;&amp;",
    );
  });

  it("operator email never contains user-supplied markup", () => {
    const html = operatorLeadEmailHtml(
      { id: "abc", sourcePath: evil, kontaktNamn: evil, epost: evil, telefon: evil },
      null,
    );
    expect(html).not.toContain("<a href=\"https://evil.example\"");
    expect(html).toContain("&lt;a href=&quot;https://evil.example&quot;");
  });

  it("calculator email to the lead escapes the name", () => {
    const html = calculatorLeadEmailHtml(evil, { rangeLowSek: 1000, rangeHighSek: 2000, riskBand: "MEDIUM" });
    expect(html).not.toContain("https://evil.example\"");
    expect(html).toContain("&lt;a href=");
    expect(html).toContain("https://brfinspektion.se/statusbesiktning");
  });

  it("cleanSubject strips CR/LF", () => {
    expect(cleanSubject("Ny lead: A\r\nBcc: x@y.z")).toBe("Ny lead: A Bcc: x@y.z");
  });
});
