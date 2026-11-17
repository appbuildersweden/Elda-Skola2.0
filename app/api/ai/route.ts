import { NextResponse } from "next/server";
import { parseArtifact, type ArtifactFormat } from "@/lib/artifacts";

type ChatMessage = { role: "user" | "assistant"; content: string };

const PERSONAS = {
  elev: [
    "Du är Ella, 15 år och AI-elev på Elda-Skola.",
    "Du pratar som en kompis: jag-form, vardagligt och varmt, aldrig stelt eller som en lärobok.",
    "Du svarar kort — oftast en till tre meningar — och ger bara ett litet exempel när det hjälper.",
    "Du minns vad eleven sagt tidigare i samtalet och knyter an till det, till exempel 'som du sa om …'.",
    "Du ställer ibland en kort följdfråga i stället för att skriva allt på en gång.",
    "Du skriver aldrig rubriker eller långa listor om eleven inte ber om det, och du påminner aldrig om att du är en AI.",
    "Du säger 'du' till eleven och skriver alltid på svenska.",
  ].join(" "),
  larare: [
    "Du är AI-läraren på Elda-Skola och pratar i jag-form, varmt och personligt, som en lärare som känner eleven.",
    "Du förklarar kort och steg för steg, med elevens egna ord, och knyter an till det eleven sagt tidigare i samtalet.",
    "Håll svaret under cirka 80 ord när eleven bara ställer en fråga. Är det quiz, flashcards, anteckningar, fokustimer eller läxplan får svaret vara längre.",
    "Avsluta gärna med en kort kontrollfråga eller ett litet nästa steg i stället för en lång sammanfattning.",
    "Om du inte kan svara på frågan, eller inte vet säkert, säger du det rakt ut: 'Det här kan jag inte svara på.' Förklara kort varför och föreslå vad eleven kan göra i stället, till exempel fråga sin lärare eller vilket avsnitt i boken som gäller.",
    "Du gissar aldrig och hittar aldrig på fakta, källor eller siffror för att verka hjälpsam.",
    "Inga tunga rubriker eller tabeller för korta svar, och du påminner aldrig om att du är en AI.",
    "Du säger 'du' till eleven och skriver alltid på svenska.",
  ].join(" "),
} as const;

const FORMAT_RULES: Record<ArtifactFormat, string> = {
  flashcards:
    'Svara ENDAST med JSON: {"intro":"en kort mening","title":"...","cards":[{"front":"fråga","back":"svar"}]}. Gör 6 till 10 kort.',
  quiz:
    'Svara ENDAST med JSON: {"intro":"en kort mening","title":"...","questions":[{"question":"...","options":["A","B","C","D"],"answer":0}]}. Gör 4 till 6 frågor, answer är index för rätt alternativ.',
  anteckningar:
    'Svara ENDAST med JSON: {"intro":"en kort mening","title":"...","sections":[{"title":"...","points":["..."]}]}. Gör 2 till 5 sektioner med 2 till 5 punkter i varje.',
  fokustimer:
    'Svara ENDAST med JSON: {"intro":"en kort mening","title":"...","minutes":25,"blocks":[{"label":"Fokus","minutes":25}]}. minutes är fokuspassets längd, blocks beskriver passet inklusive paus och repetition.',
  laxplan:
    'Svara ENDAST med JSON: {"intro":"en kort mening","title":"...","days":[{"day":"Måndag","items":["..."]}]}. Ta med veckans dagar som behövs.',
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const url = process.env.OPENROUTER_CHAT_URL;
  // Kortare budget för den snabba modellen = snabbare svar; reservmodellen
  // behöver mer utrymme eftersom den resonerar innan den svarar.
  const models = [
    { name: process.env.OPENROUTER_CHAT_MODEL, maxTokens: 600 },
    { name: process.env.OPENROUTER_CHAT_FALLBACK, maxTokens: 1600 },
  ].filter((model): model is { name: string; maxTokens: number } =>
    Boolean(model.name),
  );

  if (!apiKey || !url || models.length === 0) {
    return NextResponse.json(
      { error: "AI är inte konfigurerad på servern." },
      { status: 500 },
    );
  }

  let body: {
    persona?: keyof typeof PERSONAS;
    messages?: ChatMessage[];
    format?: ArtifactFormat;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  const messages = history
    .filter(
      (m): m is ChatMessage =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m?.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (messages.length === 0) {
    return NextResponse.json({ error: "Skriv en fråga först." }, { status: 400 });
  }

  const format =
    body.format && body.format in FORMAT_RULES ? body.format : undefined;
  const persona = [
    body.persona === "larare" ? PERSONAS.larare : PERSONAS.elev,
    format ? FORMAT_RULES[format] : "",
    format
      ? "Skriv ingen text före eller efter JSON och inga kodblock."
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  let lastError = "AI:n svarade inte. Försök igen.";

  // Gratisnivån kan svara 429 eller tomt enstaka gånger — försök en gång till
  // per modell innan vi ger upp.
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "X-Title": "Elda-Skola",
          },
          body: JSON.stringify({
            model: model.name,
            messages: [{ role: "system", content: persona }, ...messages],
            temperature: 0.6,
            // JSON-material behöver mer utrymme än ett vanligt chattsvar.
            max_tokens: format ? 1500 : model.maxTokens,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const upstream = String(data?.error?.message ?? "");
          lastError =
            response.status === 429
              ? upstream.includes("free-models-per-day")
                ? "Dagens gratisgräns för AI är slut. Lägg till kredit på OpenRouter eller försök igen imorgon."
                : "AI:n är upptagen just nu. Försök igen om en stund."
              : (upstream || lastError);

          if (response.status !== 429 && response.status < 500) break;
          await new Promise((resolve) => setTimeout(resolve, 700));
          continue;
        }

        const reply: string | undefined = data?.choices?.[0]?.message?.content;

        if (reply && reply.trim().length > 0) {
          if (format) {
            const artifact = parseArtifact(format, reply);
            if (artifact) {
              return NextResponse.json({ reply: artifact.intro, artifact });
            }
            await new Promise((resolve) => setTimeout(resolve, 300));
            continue;
          }

          return NextResponse.json({ reply });
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch {
        lastError = "Kunde inte nå AI-tjänsten.";
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  return NextResponse.json(
    { error: format ? "Kunde inte skapa materialet. Försök igen." : lastError },
    { status: 502 },
  );
}
