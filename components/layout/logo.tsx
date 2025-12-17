export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tag Icon */}
      <g transform="translate(0, 10)">
        {/* Tag body */}
        <path
          d="M8 20L20 8C22 6 24 6 26 8L52 34C54 36 54 38 52 40L40 52C38 54 36 54 34 52L8 26C6 24 6 22 8 20Z"
          fill="#D97706"
          stroke="#B45309"
          strokeWidth="1.5"
        />
        {/* Hole */}
        <circle cx="18" cy="18" r="4" fill="#F59E0B" />
        <circle cx="18" cy="18" r="2" fill="#FFFFFF" />
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
      viewBox="0 0 60 60"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tag Icon Only */}
      <path
        d="M8 20L20 8C22 6 24 6 26 8L52 34C54 36 54 38 52 40L40 52C38 54 36 54 34 52L8 26C6 24 6 22 8 20Z"
        fill="#D97706"
        stroke="#B45309"
        strokeWidth="1.5"
      />
      <circle cx="18" cy="18" r="4" fill="#F59E0B" />
      <circle cx="18" cy="18" r="2" fill="#FFFFFF" />
    </svg>
  );
}
