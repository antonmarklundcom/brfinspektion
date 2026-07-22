// Small inline icon set so marketing components don't need an external
// icon library. Stroke-based, inherits currentColor.

type IconProps = { className?: string };

export function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUserCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 19c.7-3.2 3-5 5.5-5s3.8 1 4.7 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16.5 13.5l1.7 1.7 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClipboard({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5.5" y="4.5" width="13" height="16" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 4.5V4a1.5 1.5 0 013 0v.5m0 0h-3m3 0h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.5 11.5l1.8 1.8L14.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 16.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconCoins({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <ellipse cx="9" cy="8" rx="5.5" ry="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 8v4c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3V8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 12v4c0 1.7 2.5 3 5.5 3 1 0 1.9-.15 2.7-.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14.5 10.3c2.9.3 5 1.5 5 2.9s-2.5 3-5.5 3c-.8 0-1.5-.1-2.2-.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function IconBuilding({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4.5" y="3.5" width="10" height="17" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14.5" y="9.5" width="5" height="11" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 7h2M11 7h0M7 10.5h2M11 10.5h0M7 14h2M11 14h0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 13h0M17 16.5h0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconHandshake({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 11l3.5-3 3 2 2.5-2 3 2 3-2 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 8v6.5l3 2.5 2-1.5 2 1.8 2.2-1.8 3-2.5V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
