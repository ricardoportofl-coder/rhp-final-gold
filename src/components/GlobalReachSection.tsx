const flags = [
  { code: "BR", label: "Brazil - Portuguese", flagCdn: "br" },
  { code: "US", label: "USA - English", flagCdn: "us" },
  { code: "ES", label: "Spain - Spanish", flagCdn: "es" },
  { code: "MX", label: "Mexico - Spanish", flagCdn: "mx" },
  { code: "FR", label: "France - French", flagCdn: "fr" },
  { code: "DE", label: "Germany - German", flagCdn: "de" },
  { code: "IT", label: "Italy - Italian", flagCdn: "it" },
  { code: "CN", label: "China - Mandarin", flagCdn: "cn" },
  { code: "JP", label: "Japan - Japanese", flagCdn: "jp" },
  { code: "JP", label: "Japan - Japanese", flagCdn: "jp" },
  { code: "IN", label: "India - Hindi", flagCdn: "in" },
  { code: "AR", label: "Pakistan - Urdu", flagCdn: "pk" },
  { code: "UK", label: "United Kingdom - English", flagCdn: "gb" },
  { code: "CA", label: "Canada - English/French", flagCdn: "ca" },
  { code: "AU", label: "Australia - English", flagCdn: "au" },
  { code: "NZ", label: "New Zealand - English", flagCdn: "nz" },
  { code: "RU", label: "Russia - Russian", flagCdn: "ru" },
  { code: "KR", label: "South Korea - Korean", flagCdn: "kr" },
  { code: "ZA", label: "South Africa - English", flagCdn: "za" },
  { code: "CH", label: "Switzerland - German/French/Italian", flagCdn: "ch" },
  { code: "SE", label: "Sweden - Swedish", flagCdn: "se" },
  { code: "NO", label: "Norway - Norwegian", flagCdn: "no" },
  { code: "FI", label: "Finland - Finnish", flagCdn: "fi" },
  { code: "DK", label: "Denmark - Danish", flagCdn: "dk" },
  { code: "NL", label: "Netherlands - Dutch", flagCdn: "nl" },
  { code: "BE", label: "Belgium - French/Dutch", flagCdn: "be" },
  { code: "TR", label: "Turkey - Turkish", flagCdn: "tr" },
  { code: "SA", label: "Saudi Arabia - Arabic", flagCdn: "sa" },
  { code: "AE", label: "UAE - Arabic", flagCdn: "ae" },
  { code: "EG", label: "Egypt - Arabic", flagCdn: "eg" },
];

export default function GlobalReachSection() {
  return (
    <section
      className="px-4 py-20 md:px-8"
      style={{ background: "radial-gradient(140% 120% at 50% 0%, #191813 0%, #0a0908 62%, #040404 100%)" }}
    >
      <div
        className="mx-auto max-w-6xl rounded-[26px] px-5 py-8 md:px-8 md:py-10"
        style={{
          border: "1px solid rgba(211,176,103,0.5)",
          boxShadow: "0 0 60px rgba(186,147,72,0.16), inset 0 0 18px rgba(186,147,72,0.07)",
          background: "linear-gradient(180deg, rgba(10,10,10,0.96) 0%, rgba(7,7,7,0.98) 100%)",
        }}
      >
        <h2
          className="text-center font-body text-[2.15rem] leading-tight md:text-5xl"
          style={{ color: "#f2f2f0", fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Global Reach - Multilingual Intelligence
        </h2>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-6 gap-x-6 gap-y-5">
          {flags.map((flag, index) => (
            <article key={`${flag.code}-${index}`} className="flex flex-col items-center text-center">
              <img
                src={`https://flagcdn.com/w80/${flag.flagCdn}.png`}
                alt={flag.label}
                className="h-[48px] w-[80px] rounded-[10px] object-cover"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='48'%3E%3Crect width='100%25' height='100%25' fill='%23161616'/%3E%3Ctext x='50%25' y='52%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='9' fill='%23e6e6e6'%3EFLAG%3C/text%3E%3C/svg%3E";
                }}
              />
              <p
                className="mt-2 font-body text-[0.97rem] leading-none"
                style={{ color: "#f3f1ee", fontWeight: 350, whiteSpace: "nowrap" }}
              >
                {flag.label}
              </p>
            </article>
          ))}
        </div>

        <p
          className="mt-9 text-center font-body text-[1.95rem] leading-tight"
          style={{ color: "#f0efed", fontWeight: 350 }}
        >
          AI-driven native support. Your business, global and borderless.
        </p>
      </div>
    </section>
  );
}
