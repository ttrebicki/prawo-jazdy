const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function IconArrowLeft() {
  return (
    <svg {...iconProps}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

export function IconMoreHorizontal() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  )
}

export function IconDownload() {
  return (
    <svg {...iconProps} width={20} height={20}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  )
}

export function IconFolderOpen() {
  return (
    <svg {...iconProps} width={20} height={20}>
      <path d="M6 14h12M6 14V8a2 2 0 0 1 2-2h3l2 2h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
    </svg>
  )
}

export function IconArrowRight() {
  return (
    <svg {...iconProps}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function IconInfo() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

export function IconSmartphone() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  )
}

export function IconCheckDouble() {
  return (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M7 12l3 3 7-7M3 12l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconBookOpenCheck() {
  return (
    <svg {...iconProps}>
      <path d="M12 11V7M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  )
}

export function IconSignal() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="2" y="14" width="3" height="6" rx="0.5" />
      <rect x="7" y="10" width="3" height="10" rx="0.5" />
      <rect x="12" y="6" width="3" height="14" rx="0.5" />
      <rect x="17" y="2" width="3" height="18" rx="0.5" />
    </svg>
  )
}

export function IconWifi() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M5 12.55a11 11 0 0 1 14.08 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" strokeLinecap="round" />
    </svg>
  )
}

export function IconBattery() {
  return (
    <svg width={25} height={18} viewBox="0 0 28 14" fill="none" aria-hidden>
      <rect x="1" y="2" width="22" height="10" rx="2" stroke="currentColor" strokeWidth={1.5} />
      <rect x="3" y="4" width="16" height="6" rx="1" fill="currentColor" />
      <path d="M24 5v4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}
