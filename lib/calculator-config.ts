import { StamTyp } from "@prisma/client";

// TODO-PRICING (plan.md D1): these coefficients are deliberately wide
// placeholders, NOT calibrated figures. Real per-apartment cost ranges and
// risk weighting must come from Partner B before this business relies on
// the output. UI copy must present the result as a "grov uppskattning" and
// pivot the visitor toward booking a statusbesiktning rather than trusting
// the number. Do not tighten these ranges without a real data source.

export const PER_APARTMENT_RANGE_SEK: Record<StamTyp, { low: number; high: number }> = {
  GJUTJARN: { low: 150_000, high: 300_000 },
  PLAST_PVC: { low: 100_000, high: 220_000 },
  KOPPAR: { low: 120_000, high: 260_000 },
  RELINADE: { low: 60_000, high: 150_000 },
  VET_EJ: { low: 100_000, high: 300_000 },
};

export const AGE_RISK_THRESHOLDS = {
  // byggår older than this without a documented stambyte/relining is high risk
  highRiskBuildYear: 1975,
  mediumRiskBuildYear: 1995,
};

export const SENASTE_STAMBYTE_RISK_WEIGHT: Record<string, number> = {
  ALDRIG: 3,
  "0_10": 0,
  "10_30": 1,
  "30_PLUS": 3,
  VET_EJ: 2,
};

export const KNOWN_PROBLEM_RISK_WEIGHT = 1; // per selected problem, added to risk score

export const RISK_BAND_THRESHOLDS = {
  LAG: 0, // score <= this -> LAG
  MEDEL: 3, // score <= this -> MEDEL
  HOG: 6, // score <= this -> HOG, above -> AKUT
};
