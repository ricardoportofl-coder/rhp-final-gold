import { Calendar, Clock3, User } from "lucide-react";

const cards = [
  {
    id: "gym",
    title: "GYM:",
    subtitle: "Workout Scheduling",
    image: "/assets/personal/gym-card.png",
    alt: "Personal trainer gym card",
  },
  {
    id: "road",
    title: "ON THE ROAD:",
    subtitle: "Smart Strategic Routing",
    image: "/assets/personal/road-card.png",
    alt: "On the road planning card",
  },
  {
    id: "beach",
    title: "AT THE BEACH:",
    subtitle: "Personal Concierge Support",
    image: "/assets/personal/beach-card.png",
    alt: "At the beach WhatsApp support card",
  },
];

function CardFooterIcons({ cardId }: { cardId: string }) {
  if (cardId === "gym" || cardId === "road" || cardId === "beach") {
    return (
      <div className="mt-3 flex items-center gap-4" style={{ color: "#e8d6b4" }}>
        <Calendar className="h-4 w-4" strokeWidth={1.8} />
        <Clock3 className="h-4 w-4" strokeWidth={1.8} />
        <User className="h-4 w-4" strokeWidth={1.8} />
      </div>
    );
  }

  return null;
}

export default function PersonalLevelSection() {
  return (
    <section
      className="relative overflow-hidden px-4 py-20 md:px-8"
      style={{ background: "radial-gradient(120% 120% at 50% 0%, #1b1a16 0%, #080807 60%, #040404 100%)" }}
    >
      <div className="mx-auto max-w-6xl">
        <h2
          className="mb-8 text-center font-body text-4xl md:text-5xl"
          style={{ color: "#e8d6b4", fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          Personal AI Assistant
        </h2>

        <div className="grid gap-8 md:grid-cols-3 md:gap-7">
          {cards.map((card) => (
            <article key={card.id} className="mx-auto w-full max-w-[360px]">
              <div
                className="relative overflow-hidden p-[2px]"
                style={{
                  clipPath: "polygon(8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%, 0 8%)",
                  background: "linear-gradient(140deg, rgba(201,166,98,0.92) 0%, rgba(96,75,36,0.9) 50%, rgba(204,169,99,0.9) 100%)",
                  boxShadow: "0 0 40px rgba(201,166,98,0.22), 0 0 14px rgba(201,166,98,0.35)",
                }}
              >
                <div
                  className="overflow-hidden"
                  style={{
                    clipPath: "polygon(8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%, 0 8%)",
                    background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)",
                  }}
                >
                  <div className="relative">
                    <img src={card.image} alt={card.alt} className="h-[430px] w-full object-cover" loading="lazy" />
                  </div>
                  <div className="px-5 pb-5 pt-4 text-left">
                    <p className="font-body text-[2rem] font-semibold leading-none" style={{ color: "#f1dfbe" }}>
                      {card.title}
                    </p>
                    <p
                      className="mt-2 font-body text-2xl leading-tight"
                      style={{ color: "#f8f6f1", fontWeight: card.id === "road" || card.id === "beach" ? 700 : 300 }}
                    >
                      {card.subtitle}
                    </p>
                    <CardFooterIcons cardId={card.id} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://wa.me/13059227181"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-20 w-20 items-center justify-center rounded-[26px]"
            style={{
              background: "#25D366",
              boxShadow: "0 0 36px rgba(37,211,102,0.55), 0 8px 24px rgba(0,0,0,0.45)",
            }}
            aria-label="Conectar no WhatsApp"
          >
            <svg viewBox="0 0 32 32" width="44" height="44" fill="none" aria-hidden="true">
              <path
                d="M16 2.5C8.54 2.5 2.5 8.54 2.5 16a13.38 13.38 0 0 0 1.87 6.85L2.5 29.5l6.86-1.8A13.45 13.45 0 0 0 16 29.5c7.46 0 13.5-6.04 13.5-13.5S23.46 2.5 16 2.5Z"
                fill="white"
                fillOpacity="0.17"
              />
              <path
                d="M24.22 19.2c-.35-.17-2.06-1.02-2.38-1.14-.32-.11-.56-.17-.79.18-.23.34-.9 1.14-1.1 1.37-.2.23-.4.26-.74.09-.35-.17-1.46-.53-2.78-1.7a10.23 10.23 0 0 1-1.92-2.38c-.2-.34-.02-.52.15-.7.16-.16.35-.4.52-.6.17-.2.23-.34.35-.57.11-.23.06-.43-.03-.6-.09-.17-.8-1.92-1.1-2.63-.29-.7-.58-.6-.79-.6h-.67c-.23 0-.6.09-.92.43-.32.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.88 5.04.82.35 1.46.56 1.96.73.82.26 1.57.23 2.15.14.65-.1 2.06-.85 2.35-1.67.3-.82.3-1.52.2-1.67-.08-.14-.31-.23-.66-.4Z"
                fill="white"
              />
            </svg>
          </a>

          <p className="mt-6 font-body text-[2rem] font-semibold" style={{ color: "#e8d6b4" }}>
            CONNECT:
          </p>
          <p className="mt-1 font-body text-[1.9rem]" style={{ color: "#f8f6f1", fontWeight: 300 }}>
            WhatsApp. Ask us now.
          </p>
        </div>
      </div>
    </section>
  );
}
