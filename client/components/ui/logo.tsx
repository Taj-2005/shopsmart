interface LogoProps {
  size?: number;
  className?: string;
}

const LOGO_BASE_SIZE = 300;

export function Logo({ size = 32, className = "" }: LogoProps) {
  const s = size / LOGO_BASE_SIZE;
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: "var(--accent-primary, #00C2B2)" }}
      />
      <span
        className="absolute flex items-center justify-center"
        style={{
          width: 140 * s,
          height: 200 * s,
          left: (LOGO_BASE_SIZE - 140) * s * 0.5,
          top: (LOGO_BASE_SIZE - 200) * s * 0.5,
        }}
      >
        <span
          className="absolute rounded-full bg-white"
          style={{
            width: 80 * s,
            height: 80 * s,
            left: 30 * s,
            top: 0,
          }}
        />
        <span
          className="absolute rounded-full"
          style={{
            width: 50 * s,
            height: 50 * s,
            left: 10 * s,
            top: 40 * s,
            backgroundColor: "var(--accent-primary, #00C2B2)",
          }}
        />
        <span
          className="absolute rounded-lg bg-white"
          style={{
            width: 50 * s,
            height: 100 * s,
            left: 45 * s,
            top: 50 * s,
            transform: "rotate(-15deg)",
            borderRadius: 25 * s,
          }}
        />
        <span
          className="absolute rounded-full bg-white"
          style={{
            width: 80 * s,
            height: 80 * s,
            left: 30 * s,
            bottom: 0,
          }}
        />
        <span
          className="absolute rounded-full"
          style={{
            width: 50 * s,
            height: 50 * s,
            left: 70 * s,
            top: 110 * s,
            backgroundColor: "var(--accent-primary, #00C2B2)",
          }}
        />
      </span>
    </span>
  );
}
