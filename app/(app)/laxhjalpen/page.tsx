import AiChat from "@/components/ai-chat";
import PageHeading from "@/components/page-heading";

export const metadata = { title: "Läxhjälpen · Elda Skola 2.0" };

const suggestions = [
  {
    label: "Flashcards",
    prompt:
      "Gör 8 flashcards om det jag pluggar. Skriv en fråga och ett svar per kort.",
    format: "flashcards" as const,
  },
  {
    label: "Quiz",
    prompt:
      "Gör ett quiz med 5 frågor och fyra svarsalternativ, och markera rätt svar.",
    format: "quiz" as const,
  },
  {
    label: "Anteckningar",
    prompt:
      "Sammanfatta det jag ska lära mig som korta anteckningar med rubriker och punktlistor.",
    format: "anteckningar" as const,
  },
  {
    label: "Fokustimer",
    prompt:
      "Gör en fokustimer för 25 minuters fokus med paus och repetition, och berätta vad jag ska göra i varje block.",
    format: "fokustimer" as const,
  },
  {
    label: "Läxplanerare",
    prompt:
      "Gör en läxplanerare för veckan: vilka ämnen jag tar vilka dagar, hur länge varje pass är och vad jag ska hinna med.",
    format: "laxplan" as const,
  },
];

export default function LaxhjalpenPage() {
  return (
    <>
      <PageHeading
        kicker="AI-lärare"
        title="Läxhjälpen"
        description="Få hjälp av AI-läraren när du kör fast, bifoga dina anteckningar och be den göra flashcards, quiz eller en läxplan."
      />

      <AiChat
        persona="larare"
        title="Fråga AI-läraren"
        intro="Berätta vad du jobbar med, så tar vi det steg för steg. Bifoga gärna en textfil med dina anteckningar — eller tryck på en genväg nedan för att få flashcards, quiz, anteckningar, en fokustimer eller en läxplan."
        placeholder="Skriv din fråga …"
        suggestions={suggestions}
      />
    </>
  );
}
