import type { ReactNode } from 'react'

type EmptyStateVariant = 'error' | 'no-results' | 'no-groups' | 'empty'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  variant?: EmptyStateVariant
  role?: 'status' | 'alert'
}

function Illustration({ variant }: { variant: EmptyStateVariant }) {
  const common = {
    viewBox: '0 0 120 100',
    className: 'h-28 w-32',
    'aria-hidden': true,
  } as const
  switch (variant) {
    case 'error':
      return (
        <svg {...common}>
          <circle cx="60" cy="58" r="34" fill="#FBE0AB" />
          <circle
            cx="48"
            cy="52"
            r="6"
            fill="#2B2A33"
            style={{ animation: 'cc-blink 4s infinite' }}
          />
          <circle
            cx="72"
            cy="52"
            r="6"
            fill="#2B2A33"
            style={{ animation: 'cc-blink 4s infinite' }}
          />
          <circle cx="38" cy="66" r="5" fill="#F2A0A0" />
          <circle cx="82" cy="66" r="5" fill="#F2A0A0" />
          <circle cx="60" cy="70" r="5" fill="#D2372F" />
          <circle cx="30" cy="24" r="7" fill="#D2372F" opacity=".55" />
          <circle cx="94" cy="30" r="5" fill="#0EA5E9" opacity=".5" />
        </svg>
      )
    case 'no-results':
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="30" fill="#DDEBF5" />
          <circle cx="50" cy="56" r="5" fill="#2B2A33" />
          <circle cx="70" cy="56" r="5" fill="#2B2A33" />
          <circle cx="60" cy="72" r="4" fill="#7C93A3" />
          <circle
            cx="92"
            cy="34"
            r="14"
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="6"
          />
          <rect
            x="100"
            y="46"
            width="16"
            height="7"
            rx="3.5"
            fill="#0EA5E9"
            transform="rotate(40 100 46)"
          />
        </svg>
      )
    case 'no-groups':
      return (
        <svg {...common}>
          <rect x="26" y="40" width="68" height="46" rx="12" fill="#F1ECE2" />
          <rect x="26" y="40" width="68" height="12" rx="6" fill="#E0D9CB" />
          <circle cx="46" cy="66" r="7" fill="#FBBF24" />
          <circle cx="66" cy="66" r="7" fill="#D2372F" opacity=".35" />
          <circle cx="86" cy="66" r="7" fill="#0EA5E9" opacity=".35" />
          <circle cx="60" cy="22" r="9" fill="#FBBF24" />
        </svg>
      )
    case 'empty':
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="32" fill="#E6F3E4" />
          <circle cx="49" cy="55" r="5" fill="#2B2A33" />
          <circle cx="71" cy="55" r="5" fill="#2B2A33" />
          <circle cx="60" cy="70" r="6" fill="#7FA37A" />
          <circle cx="26" cy="30" r="6" fill="#65A30D" opacity=".5" />
          <circle cx="98" cy="26" r="8" fill="#65A30D" opacity=".3" />
        </svg>
      )
  }
}

/** A friendly, centred message for empty / no-result / error situations. */
function EmptyState({
  title,
  description,
  action,
  variant = 'empty',
  role = 'status',
}: EmptyStateProps) {
  return (
    <div
      role={role}
      className="flex flex-col items-center gap-3.5 rounded-[28px] border border-zinc-900/5 bg-white px-6 py-8 text-center shadow-[0_18px_34px_-22px_rgba(43,42,51,.5)]"
    >
      <Illustration variant={variant} />
      <b className="font-display text-[23px] font-extrabold text-ink">
        {title}
      </b>
      {description && (
        <span className="max-w-md text-[15px] font-semibold leading-relaxed text-stone-600">
          {description}
        </span>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

export default EmptyState
