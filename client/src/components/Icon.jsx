// Ícones de traço (SVG) — substituem emojis. Stroke currentColor, 24x24.
const PATHS = {
  check: <polyline points="20 6 9 17 4 12" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  scale: (
    <>
      <path d="M12 3v18M7 21h10" />
      <path d="M5 7h14l-3 7a3 3 0 0 1-8 0L5 7z" opacity=".5" />
      <path d="M12 3l7 4M12 3L5 7" />
    </>
  ),
  heart: <path d="M19 14c1.5-1.5 2-3.5 2-5a4.5 4.5 0 0 0-8-2.8A4.5 4.5 0 0 0 5 9c0 1.5.5 3.5 2 5l5 5 5-5z" />,
  activity: <path d="M3 12h4l3 8 4-16 3 8h4" />,
  leaf: (
    <>
      <path d="M4 20c8 0 16-4 16-14 0 0-2-2-6-2-6 0-10 4-10 10 0 4 0 6 0 6z" />
      <path d="M4 20c4-6 8-8 12-9" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  droplet: <path d="M12 3s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10z" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      <polyline points="9 12 11 14 15 10" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  spark: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" />
    </>
  ),
};

export default function Icon({ name, size = 24, stroke = 1.6, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] || PATHS.spark}
    </svg>
  );
}
