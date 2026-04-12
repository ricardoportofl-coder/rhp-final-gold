import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground font-display">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground font-display">
          Página não encontrada
        </h2>
        <p className="mt-2 text-sm text-muted-foreground font-body">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 font-body"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gabriele's Golden Voice — Locução Profissional com IA" },
      { name: "description", content: "Inteligência artificial com a elegância de uma voz humana. Locução profissional premium para cada necessidade." },
      { name: "author", content: "Gabriele's Golden Voice" },
      { property: "og:title", content: "Gabriele's Golden Voice — Locução Profissional com IA" },
      { property: "og:description", content: "Inteligência artificial com a elegância de uma voz humana. Locução profissional premium para cada necessidade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Gabriele's Golden Voice — Locução Profissional com IA" },
      { name: "twitter:description", content: "Inteligência artificial com a elegância de uma voz humana. Locução profissional premium para cada necessidade." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/528e6bb9-7bc8-4de3-8a42-38b2699a7b43/id-preview-9cce69e3--ec059916-16a2-47bc-b239-a206903db5cb.lovable.app-1775936615148.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/528e6bb9-7bc8-4de3-8a42-38b2699a7b43/id-preview-9cce69e3--ec059916-16a2-47bc-b239-a206903db5cb.lovable.app-1775936615148.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
