import { StamTyp } from "@prisma/client";
import {
  AGE_RISK_THRESHOLDS,
  KNOWN_PROBLEM_RISK_WEIGHT,
  PER_APARTMENT_RANGE_SEK,
  RISK_BAND_THRESHOLDS,
  SENASTE_STAMBYTE_RISK_WEIGHT,
} from "@/lib/calculator-config";

export type SenasteStambyte = "ALDRIG" | "0_10" | "10_30" | "30_PLUS" | "VET_EJ";

export type RiskBand = "LAG" | "MEDEL" | "HOG" | "AKUT";

export interface CalculatorInput {
  byggAr: number;
  antalLagenheter: number;
  stamTyp: StamTyp;
  senasteStambyte: SenasteStambyte;
  kandaProblem: string[];
}

export interface CalculatorResult {
  rangeLowSek: number;
  rangeHighSek: number;
  perApartmentLowSek: number;
  perApartmentHighSek: number;
  riskBand: RiskBand;
  riskFactors: string[];
}

function ageRiskScore(byggAr: number, senasteStambyte: SenasteStambyte): {
  score: number;
  factor: string | null;
} {
  if (senasteStambyte === "0_10") {
    return { score: 0, factor: null };
  }
  if (byggAr <= AGE_RISK_THRESHOLDS.highRiskBuildYear) {
    return { score: 3, factor: `Fastigheten är byggd ${byggAr} eller tidigare` };
  }
  if (byggAr <= AGE_RISK_THRESHOLDS.mediumRiskBuildYear) {
    return { score: 1, factor: `Fastigheten är byggd ${byggAr}` };
  }
  return { score: 0, factor: null };
}

function riskBandFromScore(score: number): RiskBand {
  if (score <= RISK_BAND_THRESHOLDS.LAG) return "LAG";
  if (score <= RISK_BAND_THRESHOLDS.MEDEL) return "MEDEL";
  if (score <= RISK_BAND_THRESHOLDS.HOG) return "HOG";
  return "AKUT";
}

export function calculate(input: CalculatorInput): CalculatorResult {
  const { byggAr, antalLagenheter, stamTyp, senasteStambyte, kandaProblem } = input;

  const perApartment = PER_APARTMENT_RANGE_SEK[stamTyp];

  const riskFactors: string[] = [];
  let score = 0;

  const age = ageRiskScore(byggAr, senasteStambyte);
  score += age.score;
  if (age.factor) riskFactors.push(age.factor);

  const stambyteWeight = SENASTE_STAMBYTE_RISK_WEIGHT[senasteStambyte] ?? 0;
  score += stambyteWeight;
  if (senasteStambyte === "ALDRIG") {
    riskFactors.push("Inget tidigare stambyte eller relining är känt");
  } else if (senasteStambyte === "30_PLUS") {
    riskFactors.push("Senaste stambyte/relining var för mer än 30 år sedan");
  } else if (senasteStambyte === "VET_EJ") {
    riskFactors.push("Okänt när senaste stambyte/relining gjordes");
  }

  if (kandaProblem.length > 0 && !kandaProblem.includes("INGA_KANDA")) {
    score += kandaProblem.length * KNOWN_PROBLEM_RISK_WEIGHT;
    riskFactors.push(`Kända problem rapporterade: ${kandaProblem.join(", ")}`);
  }

  return {
    rangeLowSek: perApartment.low * antalLagenheter,
    rangeHighSek: perApartment.high * antalLagenheter,
    perApartmentLowSek: perApartment.low,
    perApartmentHighSek: perApartment.high,
    riskBand: riskBandFromScore(score),
    riskFactors,
  };
}
