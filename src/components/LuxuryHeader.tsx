import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "universal", label: "Universal" },
  { code: "en", label: "English" },
];

export default function LuxuryHeader() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("universal");

  const currentLabel = languages.find((l) => l.code === lang)?.label;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 anim-fade-in">
      <div className="mx-auto max-w-7xl px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-display text-xl tracking-[0.08em] text-foreground" style={{ fontWeight: 400 }}>
          <span className="text-gradient-gold" style={{ fontWeight: 600 }}>G</span>olden Voice
        </a>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-border/40 bg-card/40 backdrop-blur-lg font-body text-sm text-foreground hover:border-gold/40 transition-all duration-300"
            style={{ fontWeight: 300, letterSpacing: "0.04em" }}
          >
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span>{currentLabel}</span>
            <ChevronDown
              className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-2xl border border-border/40 bg-card/85 backdrop-blur-2xl overflow-hidden"
              style={{ boxShadow: "0 16px 48px -12px hsl(35,30%,25%,0.15)" }}
            >
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 font-body text-sm transition-colors duration-150 ${
                    lang === l.code
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/40"
                  }`}
                  style={{ fontWeight: lang === l.code ? 500 : 300 }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
