interface IconProps {
  className?: string;
  strokeWidth?: number;
}

export function MenuIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="12" cy="9.5" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M6.5 18.5c1-2.4 3.1-3.7 5.5-3.7s4.5 1.3 5.5 3.7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ className, filled = false, strokeWidth = 1.5 }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} className={className} aria-hidden="true">
      <path
        d="M12 20.5S3.5 15.5 3.5 9.6C3.5 6.8 5.7 4.5 8.5 4.5c1.5 0 2.8.7 3.5 1.8.7-1.1 2-1.8 3.5-1.8 2.8 0 5 2.3 5 5.1 0 5.9-8.5 10.9-8.5 10.9Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="m6 9.5 6 5 6-5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="m9.5 6 5 6-5 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3L2.8 9.5l6.4-.8L12 2.8Z" />
    </svg>
  );
}

export function TagIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 11.2V4.5c0-.6.4-1 1-1h6.7c.3 0 .5.1.7.3l8 8c.4.4.4 1 0 1.4l-6.7 6.7c-.4.4-1 .4-1.4 0l-8-8a1 1 0 0 1-.3-.7Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.4" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export function HomeIcon({ className, filled = false, strokeWidth = 1.5 }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} className={className} aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20c0 .6-.4 1-1 1h-4.5v-5.5h-5V21H5c-.6 0-1-.4-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartAccentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 21S2.5 15.4 2.5 9C2.5 5.9 5 3.5 8 3.5c1.6 0 3.1.8 4 2 .9-1.2 2.4-2 4-2 3 0 5.5 2.4 5.5 5.5C21.5 15.4 12 21 12 21Z" />
    </svg>
  );
}
