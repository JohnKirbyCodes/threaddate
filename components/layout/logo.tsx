export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tag Icon */}
      <g transform="translate(0, 5) scale(0.14)">
        {/* Main Tag Body */}
        <path
          d="M455.5 106.3l-192-96c-8.7-4.4-18.9-4.4-27.6 0l-192 96C26.7 114.9 16 132.8 16 152v208c0 26.5 21.5 48 48 48h384c26.5 0 48-21.5 48-48V152c0-19.2-10.7-37.1-27.5-45.7z"
          fill="#EA580C"
        />

        {/* Highlight/Detail */}
        <path
          d="M48 152l208 104 208-104"
          stroke="white"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.2"
        />

        {/* Tag Hole */}
        <circle cx="256" cy="112" r="32" fill="white" />
      </g>

      {/* ThreadDate Text */}
      <text
        x="70"
        y="50"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="700"
        fill="#1C1917"
      >
        ThreadDate
      </text>
    </svg>
  );
}

export function LogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main Tag Body */}
      <path
        d="M455.5 106.3l-192-96c-8.7-4.4-18.9-4.4-27.6 0l-192 96C26.7 114.9 16 132.8 16 152v208c0 26.5 21.5 48 48 48h384c26.5 0 48-21.5 48-48V152c0-19.2-10.7-37.1-27.5-45.7z"
        fill="#EA580C"
      />

      {/* Highlight/Detail */}
      <path
        d="M48 152l208 104 208-104"
        stroke="white"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.2"
      />

      {/* Tag Hole */}
      <circle cx="256" cy="112" r="32" fill="white" />
    </svg>
  );
}
