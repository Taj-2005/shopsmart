/**
 * ShopSmart logo — teal circle with white "S".
 * Based on the CSS Generation Request design; uses brand Cognitive Teal (#00C2B2).
 */
interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  const s = size / 300; // scale from original 300px design
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Teal circle background */}
      <span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: "var(--accent-primary, #00C2B2)" }}
      />
      {/* White S shape */}
      <span
        className="absolute flex items-center justify-center"
        style={{
          width: 140 * s,
          height: 200 * s,
          left: (300 - 140) * s * 0.5,
          top: (300 - 200) * s * 0.5,
        }}
      >
        {/* Top curve of S */}
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
        {/* Middle connector */}
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
        {/* Bottom curve of S */}
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
