import { describe, expect, it } from "vitest";
import { waMeLink } from "@/lib/phone";

describe("waMeLink", () => {
  it("normalizes a local Swedish number with leading 0", () => {
    expect(waMeLink("070-123 45 67")).toBe("https://wa.me/46701234567");
  });

  it("normalizes a number already in +46 format", () => {
    expect(waMeLink("+46 70 123 45 67")).toBe("https://wa.me/46701234567");
  });

  it("normalizes a number in 0046 format", () => {
    expect(waMeLink("0046701234567")).toBe("https://wa.me/46701234567");
  });

  it("handles a landline-style 8-digit local number", () => {
    expect(waMeLink("08-123 456 78")).toBe("https://wa.me/46812345678");
  });

  it("returns null for missing input", () => {
    expect(waMeLink(null)).toBeNull();
    expect(waMeLink(undefined)).toBeNull();
    expect(waMeLink("")).toBeNull();
  });

  it("returns null rather than guessing for unparseable input", () => {
    expect(waMeLink("not a phone number")).toBeNull();
    expect(waMeLink("123")).toBeNull();
    expect(waMeLink("1-800-555-0100")).toBeNull(); // non-Swedish format
  });
});
