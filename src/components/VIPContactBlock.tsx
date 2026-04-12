const WHATSAPP_NUMBER = "13059227181";
const DISPLAY_NUMBER = "+1 (305) 922-7181";

export default function VIPContactBlock() {
  return (
    <div className="mt-20 flex flex-col items-center gap-4 text-center">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-4 px-7 py-4 rounded-2xl"
        style={{
          background: "rgba(180,150,80,0.06)",
          border: "1px solid rgba(212,176,104,0.2)",
        }}
      >
        {/* Official WhatsApp green icon */}
        <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
          <circle cx="16" cy="16" r="16" fill="#25D366" />
          <path
            d="M23.3 18.6c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2s-.9 1.2-1.1 1.4c-.2.2-.4.2-.8 0-.4-.2-1.6-.6-3-1.8-1.1-1-1.8-2.2-2-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6s-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8 0 1.7 1.2 3.3 1.4 3.5.2.2 2.4 3.6 5.8 5 .8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.2-.9 2.5-1.7.3-.9.3-1.6.2-1.7-.1-.2-.3-.3-.7-.4z"
            fill="white"
          />
        </svg>

        <span
          style={{
            fontFamily: "'Inter', 'Montserrat', system-ui, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            letterSpacing: "0.03em",
            color: "hsl(38,55%,48%)",
            fontVariantNumeric: "lining-nums tabular-nums",
          }}
        >
          {DISPLAY_NUMBER}
        </span>

        {/* Phone icon */}
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="hsl(38,55%,48%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>

      <p
        className="text-xs tracking-[0.25em] uppercase"
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          color: "hsl(30,20%,55%)",
          fontWeight: 400,
        }}
      >
        Miami-Dade, FL · USA
      </p>

      <p
        className="font-display text-sm tracking-widest uppercase"
        style={{ color: "hsl(38,55%,48%)", fontWeight: 500 }}
      >
        Direct VIP Line & AI Support
      </p>

      <p
        className="font-body text-xs max-w-md"
        style={{ color: "hsl(30,20%,50%)", fontWeight: 300 }}
      >
        All calls to this line are screened and managed by Gabriele Intelligence
      </p>
    </div>
  );
}
