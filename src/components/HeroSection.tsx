export default function HeroSection() {
  const whatsappHref = "https://wa.me/13059227181";

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/assets/home/hero/empire-hero-master.png')",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 120% at 100% 100%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.36) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-end">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto mr-4 mb-6 block h-[84px] w-[250px] rounded-lg bg-transparent opacity-0 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] md:mr-10 md:mb-8 md:h-[118px] md:w-[400px]"
          aria-label="WhatsApp. Ask to me now."
        >
          <span className="sr-only">WhatsApp. Ask to me now.</span>
        </a>
      </div>
    </section>
  );
}
