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
      <rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="10" y1="4" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14" y1="4" x2="14" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6" y="6" width="2" height="2.5" fill="#FF6B6B" />
      <rect x="12" y="6" width="2" height="2.5" fill="#FF6B6B" />
      <rect x="6" y="14" width="2" height="2.5" fill="#FF6B6B" />
      <rect x="12" y="14" width="2" height="2.5" fill="#FF6B6B" />
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
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill="currentColor"
      />
      <circle cx="12" cy="9" r="1.5" fill="#FF6B6B" />
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
      <path
        d="M19.95 21c-1.05 0-2.08-.3-3.06-.75-1.84-.9-3.65-2.25-5.32-3.92-1.66-1.67-3.02-3.48-3.92-5.32C6.3 9.13 6 8.1 6 7.05 6 6.5 6.5 6 7.05 6h3.1c.5 0 .92.41.98.91l.63 4.51c.06.52-.16 1.02-.56 1.32l-2.4 1.8c.76 1.89 2.13 3.73 3.98 5.58 1.85 1.85 3.69 3.22 5.58 3.98l1.8-2.4c.29-.4.8-.62 1.32-.56l4.51.63c.5.06.91.48.91.98v3.1c0 .55-.5 1.05-1.05 1.05z"
        fill="currentColor"
      />
      <path d="M17 12c0-.55.45-1 1-1s1 .45 1 1" stroke="#FF6B6B" strokeWidth="2" fill="none" />
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
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M2 6l10 7 10-7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M6 10l4 3 4-3" stroke="#FF6B6B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
      <circle cx="17.5" cy="6.5" r="1" fill="#FF6B6B" />
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
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.149.297-.578.966-.707 1.164-.129.198-.257.222-.554.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.052 0-2.051.405-2.801 1.14-.75.735-1.165 1.714-1.165 2.744 0 1.03.414 2.009 1.164 2.744.75.735 1.749 1.14 2.801 1.14h.004c1.052 0 2.051-.405 2.801-1.14.75-.735 1.165-1.714 1.165-2.744 0-1.03-.414-2.009-1.164-2.744-.75-.735-1.749-1.14-2.801-1.14m5.42-2.979C16.185 2.476 13.787 1.5 11.271 1.5c-5.861 0-10.639 4.74-10.639 10.574 0 1.862.505 3.684 1.461 5.275L1.221 23.5l5.938-1.906c1.525.838 3.231 1.28 4.951 1.28h.004c5.861 0 10.639-4.74 10.639-10.574 0-2.819-1.223-5.473-3.356-7.44z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="1.5" fill="#FF6B6B" />
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