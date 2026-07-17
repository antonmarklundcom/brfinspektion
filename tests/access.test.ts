import { describe, expect, it } from "vitest";
import {
  leadWhereForSession,
  projectWhereForSession,
  followUpTaskWhereForSession,
  stripOwnerOnlyFields,
  assertOwner,
  ForbiddenError,
} from "@/lib/access";

describe("access scoping (architecture.md §5, §9 test #2)", () => {
  it("OWNER gets an unrestricted where clause", () => {
    expect(leadWhereForSession({ role: "OWNER", partnerId: null })).toEqual({});
    expect(projectWhereForSession({ role: "OWNER", partnerId: null })).toEqual({});
  });

  it("PARTNER is scoped to their own partnerId", () => {
    const session = { role: "PARTNER" as const, partnerId: "partner-a" };
    expect(leadWhereForSession(session)).toEqual({ assignedPartnerId: "partner-a" });
    expect(projectWhereForSession(session)).toEqual({ partnerId: "partner-a" });
    expect(followUpTaskWhereForSession(session)).toEqual({ partnerId: "partner-a" });
  });

  it("a PARTNER session with no partnerId matches nothing rather than everything", () => {
    const session = { role: "PARTNER" as const, partnerId: null };
    const where = leadWhereForSession(session);
    expect(where).not.toEqual({});
  });

  it("strips owner-only fields (contractValueSek) for PARTNER sessions", () => {
    const record = { id: "1", contractValueSek: 500_000, serviceType: "KONTROLLANSVARIG" };
    const stripped = stripOwnerOnlyFields({ role: "PARTNER", partnerId: "partner-a" }, record);
    expect(stripped).not.toHaveProperty("contractValueSek");
    expect(stripped.serviceType).toBe("KONTROLLANSVARIG");
  });

  it("does not strip fields for OWNER sessions", () => {
    const record = { id: "1", contractValueSek: 500_000 };
    const result = stripOwnerOnlyFields({ role: "OWNER", partnerId: null }, record);
    expect(result.contractValueSek).toBe(500_000);
  });

  it("assertOwner throws ForbiddenError for PARTNER sessions", () => {
    expect(() => assertOwner({ role: "PARTNER", partnerId: "partner-a" })).toThrow(
      ForbiddenError,
    );
  });

  it("assertOwner does not throw for OWNER sessions", () => {
    expect(() => assertOwner({ role: "OWNER", partnerId: null })).not.toThrow();
  });
});
