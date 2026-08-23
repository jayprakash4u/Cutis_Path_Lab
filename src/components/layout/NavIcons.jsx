'use client';

export function BuildingIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Two window columns on a matching grid — the previous version had
          dividers at x=10/14 but windows at x=6/12, so they never aligned. */}
      <rect x="4" y="3" width="16" height="18" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="7.5" y="6.5" width="3" height="3" rx="0.5" fill="#C62F45" />
      <rect x="13.5" y="6.5" width="3" height="3" rx="0.5" fill="#C62F45" />
      <rect x="7.5" y="11.5" width="3" height="3" rx="0.5" fill="#C62F45" />
      <rect x="13.5" y="11.5" width="3" height="3" rx="0.5" fill="#C62F45" />
      <path d="M10 21v-3.5h4V21" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

export function LocationIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Solid pin with the coral dot sitting directly on it. The pin used to
          carve its own hole at r=2.5 with a r=1.5 dot inside, which left a
          visible white ring between the two. */}
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="currentColor"
      />
      <circle cx="12" cy="9" r="2.5" fill="#C62F45" />
    </svg>
  );
}

export function PhoneIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Handset redrawn to fit the 24-unit box — the old path ran to y=23.1
          and clipped. The coral is now a signal arc that reads as part of the
          icon, rather than a loose stroke floating beside the handset. */}
      <path
        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1H7.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
        fill="currentColor"
      />
      <path
        d="M15 3.2a6.2 6.2 0 0 1 5.8 5.8"
        stroke="#C62F45"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function EmailIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* One flap, in coral, aligned to the envelope corners. There used to be
          a second smaller chevron at M6 10 sitting below-left of this one. */}
      <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M3 6.5l9 6.4 9-6.4"
        stroke="#C62F45"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FacebookIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="4.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* The lens dot belongs to the mark, so it takes the icon colour */}
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function TwitterIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.81-5.974 6.81H2.306l7.644-8.74L2.25 2.25h6.814l4.707 6.217 5.467-6.217zM17.25 18.75h1.828L6.883 3.875H4.922l12.328 14.875z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WhatsAppIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brand mark — reproduced as published. No coral accent here: the
          utility icons above are two-tone by design, but a logo is not. */}
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Row icons for the mobile drawer, keyed by route. Single-weight outlines in
 * `currentColor` so each row's icon follows its text colour, including the
 * active state.
 */
export function MobileNavIcon({ href, size = 22, className = '' }) {
  const paths = {
    '/': <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" />,
    '/services': (
      <>
        <path d="M6 3v6a4 4 0 0 0 8 0V3" />
        <path d="M4.5 3h3M12.5 3h3" />
        <path d="M10 17a4 4 0 0 0 8 0v-2" />
        <circle cx="18" cy="13" r="2" />
      </>
    ),
    '/tests': (
      <>
        <path d="M9 2v7.5L4.8 17A2.4 2.4 0 0 0 6.9 21h10.2a2.4 2.4 0 0 0 2.1-3.5L15 9.5V2" />
        <path d="M7.5 2h9" />
        <path d="M6.6 15h10.8" />
      </>
    ),
    '/packages': (
      <>
        <path d="M21 8.5v7a1.5 1.5 0 0 1-.8 1.3l-7.5 4a1.5 1.5 0 0 1-1.4 0l-7.5-4A1.5 1.5 0 0 1 3 15.5v-7" />
        <path d="M3.4 7.7 11.3 3.4a1.5 1.5 0 0 1 1.4 0l7.9 4.3-8.6 4.6z" />
        <path d="M12 12.3V21" />
      </>
    ),
    '/gallery': (
      <>
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
        <circle cx="8.5" cy="10" r="1.8" />
        <path d="m3.5 17 5-4.5 4 3.5 3-2.5 5 4" />
      </>
    ),
    '/blog': (
      <>
        <path d="M5 3.5h9l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20z" />
        <path d="M14 3.5V9h5" />
        <path d="M8.5 13h7M8.5 17h4.5" />
      </>
    ),
    '/about': (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5.5" />
        <path d="M12 7.5h.01" />
      </>
    ),
    '/contact': (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="m3.5 6.5 8.5 6 8.5-6" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[href] ?? paths['/']}
    </svg>
  );
}

export function SearchIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M14.5 14.5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}