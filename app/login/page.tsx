import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Logga in · Elda Skola 2.0" };

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/admin" : "/");

  return (
    <main className="flex min-h-dvh flex-col lg:flex-row">
      <section className="relative min-h-[240px] overflow-hidden lg:min-h-dvh lg:w-[52%]">
        <picture>
          <source media="(max-width: 640px)" srcSet="/login-banner.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/login-banner-4k.webp"
            alt="Elda Skola 2.0 – skolan vid kanalen"
            width={3840}
            height={2652}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-[#0d0c0b]/35 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-6 lg:p-10">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/elda-logo.png"
              alt=""
              className="size-9 rounded-full bg-panel"
            />
            <span className="text-[11.5px] font-semibold tracking-[0.14em] text-ink">
              ELDA SKOLA 2.0
            </span>
          </div>

          <div className="mt-10 max-w-[46ch] lg:mt-0">
            <h1 className="text-[26px] leading-[1.15] font-semibold tracking-[-0.02em] text-ink lg:text-[34px]">
              Ett lugnt ställe att plugga på.
            </h1>
            <p className="mt-2.5 text-[13.5px] leading-[1.6] text-ink-soft">
              Uppdrag, AI-lärare och träning i samma skiss — logga in med
              kontot du fått av skolan.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center bg-panel px-5 py-10 lg:px-12">
        <div className="w-full max-w-[380px]">
          <p className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
            Välkommen tillbaka
          </p>
          <h2 className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em] text-ink">
            Logga in
          </h2>
          <p className="mt-1.5 mb-6 text-[12.5px] leading-[1.6] text-ink-muted">
            Elever och admin använder samma inloggning.
          </p>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
