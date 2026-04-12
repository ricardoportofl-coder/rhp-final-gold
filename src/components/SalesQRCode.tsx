import { QRCodeSVG } from "qrcode.react";

const SALES_LINK =
  "https://wa.me/13059227181?text=Hi%20Gabriele%20Sales%20Team!%20I%20just%20saw%20the%20website%20and%20I%20want%20to%20know%20how%20you%20can%20help%20my%20business%20scale.%20What's%20the%20first%20step?";

const OPS_LINK =
  "https://wa.me/13059227181?text=Hi%20Gabriele%20Operations%20Support!%20I%20need%20help%20with%20my%20current%20setup.";

const qrIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23c9a84c' opacity='0.9'/%3E%3Cpath d='M12 20 Q16 12 20 18 Q24 24 28 16' stroke='white' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M12 24 Q16 16 20 22 Q24 28 28 20' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' opacity='0.7'/%3E%3C/svg%3E";

function QRBlock({ link, label }: { link: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        style={{
          padding: "14px",
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid hsl(38,55%,48%)",
          boxShadow: "0 4px 20px rgba(180,150,80,0.08)",
        }}
      >
        <QRCodeSVG
          value={link}
          size={140}
          bgColor="#FFFFFF"
          fgColor="#1a1a1a"
          level="H"
          imageSettings={{
            src: qrIcon,
            x: undefined,
            y: undefined,
            height: 30,
            width: 30,
            excavate: true,
          }}
        />
      </a>
      <p
        style={{
          fontFamily: "'Inter', 'Montserrat', system-ui, sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.25em",
          color: "hsl(38,55%,48%)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default function SalesQRCode() {
  return (
    <div className="flex flex-col items-center gap-10 mt-8 mb-4 md:flex-row md:justify-between md:items-start md:gap-8 max-w-4xl mx-auto">
      {/* Left QR - Operations */}
      <QRBlock link={OPS_LINK} label="Operations Support" />

      {/* Center - Contact */}
      <div className="flex flex-col items-center gap-3 text-center order-first md:order-none">
        <a
          href={`https://wa.me/13059227181`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3"
        >
          <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
            <circle cx="16" cy="16" r="16" fill="#25D366" />
            <path
              d="M23.3 18.6c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2s-.9 1.2-1.1 1.4c-.2.2-.4.2-.8 0-.4-.2-1.6-.6-3-1.8-1.1-1-1.8-2.2-2-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6s-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8 0 1.7 1.2 3.3 1.4 3.5.2.2 2.4 3.6 5.8 5 .8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.2-.9 2.5-1.7.3-.9.3-1.6.2-1.7-.1-.2-.3-.3-.7-.4z"
              fill="white"
            />
          </svg>
          <span
            style={{
              fontFamily: "'Inter', 'Montserrat', system-ui, sans-serif",
              fontSize: "1.15rem",
              fontWeight: 600,
              letterSpacing: "0.03em",
              color: "hsl(38,55%,48%)",
              fontVariantNumeric: "lining-nums tabular-nums",
            }}
          >
            +1 (305) 922-7181
          </span>
        </a>

        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "hsl(30,20%,55%)",
            fontWeight: 400,
          }}
        >
          Miami-Dade, FL · USA
        </p>

        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "hsl(38,55%,48%)",
            fontWeight: 500,
          }}
        >
          Direct VIP Line & AI Support
        </p>
      </div>

      {/* Right QR - Sales */}
      <QRBlock link={SALES_LINK} label="Sales Team" />
    </div>
  );
}
