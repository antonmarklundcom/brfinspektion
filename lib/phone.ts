/**
 * Normalizes a Swedish phone number to a wa.me click-to-chat URL
 * (architecture.md §6.5: lead notification emails include a WhatsApp
 * click-to-chat link when a phone number was provided, so the operator
 * can open the conversation in one tap — no WhatsApp Business API
 * integration, just this link).
 *
 * Returns null rather than guessing when the input doesn't look like a
 * parseable Swedish number — a broken wa.me link is worse than no link.
 */
export function waMeLink(rawPhone: string | null | undefined): string | null {
  if (!rawPhone) return null;

  const digitsAndPlus = rawPhone.replace(/[^\d+]/g, "");
  let digits: string;

  if (digitsAndPlus.startsWith("+46")) {
    digits = digitsAndPlus.slice(1);
  } else if (digitsAndPlus.startsWith("0046")) {
    digits = digitsAndPlus.slice(2);
  } else if (digitsAndPlus.startsWith("46")) {
    digits = digitsAndPlus;
  } else if (digitsAndPlus.startsWith("0")) {
    digits = `46${digitsAndPlus.slice(1)}`;
  } else {
    return null;
  }

  // Swedish mobile/landline numbers are 8-9 digits after the leading 0;
  // with the "46" prefix that's 10-11 digits total. Outside that range,
  // the input probably wasn't a real Swedish number — don't emit a link.
  if (digits.length < 10 || digits.length > 11) return null;

  return `https://wa.me/${digits}`;
}
