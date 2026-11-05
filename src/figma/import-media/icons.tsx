type IconProps = { className?: string }

const iconClass = 'figma-import-media__svg'

export function IconArrowLeft({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconDownload({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 4v10m0 0l4-4m-4 4L8 10M5 20h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconImage({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path d="M5 17l5-5 4 4 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconClapperboard({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 8h16v11H4V8zm0 0l3-4h14l-3 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconArchive({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 7h16v3H4V7zm2 3v10h12V10M10 13h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconWifi({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 9.5a11 11 0 0114 0M8.5 13a6.5 6.5 0 017 0M12 17h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconInfo({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 10v6M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconFolderCheck({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 7h6l2 2h8v9H4V7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 13l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconMoreHorizontal({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function IconStatusSignal({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <rect x="2" y="14" width="3" height="6" rx="0.5" opacity="0.35" />
      <rect x="7" y="11" width="3" height="9" rx="0.5" opacity="0.55" />
      <rect x="12" y="8" width="3" height="12" rx="0.5" opacity="0.75" />
      <rect x="17" y="5" width="3" height="15" rx="0.5" />
    </svg>
  )
}

export function IconStatusWifi({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 9.5a11 11 0 0114 0M8.5 13a6.5 6.5 0 017 0M12 17h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconStatusBattery({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="25"
      height="18"
      viewBox="0 0 25 18"
      fill="none"
      aria-hidden
    >
      <rect x="1" y="3" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3.5" y="5.5" width="14" height="7" rx="1.5" fill="currentColor" />
      <path d="M22.5 7.5v5a2 2 0 000-5z" fill="currentColor" />
    </svg>
  )
}

export function IconSmartphone({ className }: IconProps) {
  return (
    <svg
      className={className ?? iconClass}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
