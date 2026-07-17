import { describe, expect, it } from "vitest";
import { calculate } from "@/lib/calculator";
import { StamTyp } from "@prisma/client";

describe("calculate", () => {
  it("returns LAG risk for a recently renovated building with no known problems", () => {
    const result = calculate({
      byggAr: 1965,
      antalLagenheter: 20,
      stamTyp: StamTyp.RELINADE,
      senasteStambyte: "0_10",
      kandaProblem: [],
    });
    expect(result.riskBand).toBe("LAG");
    expect(result.riskFactors).toHaveLength(0);
  });

  it("returns AKUT risk for an old building with no known stambyte and reported problems", () => {
    const result = calculate({
      byggAr: 1950,
      antalLagenheter: 30,
      stamTyp: StamTyp.GJUTJARN,
      senasteStambyte: "ALDRIG",
      kandaProblem: ["FUKTSKADOR", "STOPP_LACKAGE"],
    });
    expect(result.riskBand).toBe("AKUT");
    expect(result.riskFactors.length).toBeGreaterThan(0);
  });

  it("handles VET_EJ paths without throwing and produces a MEDEL-or-higher band", () => {
    const result = calculate({
      byggAr: 1980,
      antalLagenheter: 10,
      stamTyp: StamTyp.VET_EJ,
      senasteStambyte: "VET_EJ",
      kandaProblem: [],
    });
    expect(["MEDEL", "HOG", "AKUT"]).toContain(result.riskBand);
  });

  it("scales the price range linearly with antalLagenheter", () => {
    const base = calculate({
      byggAr: 2000,
      antalLagenheter: 1,
      stamTyp: StamTyp.KOPPAR,
      senasteStambyte: "10_30",
      kandaProblem: [],
    });
    const doubled = calculate({
      byggAr: 2000,
      antalLagenheter: 2,
      stamTyp: StamTyp.KOPPAR,
      senasteStambyte: "10_30",
      kandaProblem: [],
    });
    expect(doubled.rangeLowSek).toBe(base.rangeLowSek * 2);
    expect(doubled.rangeHighSek).toBe(base.rangeHighSek * 2);
  });

  it("treats INGA_KANDA as no risk contribution even if selected alongside itself", () => {
    const withNone = calculate({
      byggAr: 2010,
      antalLagenheter: 10,
      stamTyp: StamTyp.PLAST_PVC,
      senasteStambyte: "0_10",
      kandaProblem: ["INGA_KANDA"],
    });
    expect(withNone.riskFactors).toHaveLength(0);
  });
});
