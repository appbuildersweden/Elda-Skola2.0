import AiChat from "@/components/ai-chat";
import PageHeading from "@/components/page-heading";

export const metadata = { title: "Chat · Elda Skola 2.0" };

export default function ChatPage() {
  return (
    <>
      <PageHeading
        kicker="AI-elever"
        title="Chat"
        description="Prata med AI-elever som hjälper dig med läxor och förklarar ord du kör fast på."
      />

      <AiChat
        persona="elev"
        title="Ella · AI-elev"
        intro="Hej! Jag är Ella. Fråga mig vad som helst om läxan, ett begrepp eller ett ord du inte förstår — jag förklarar och ger ett exempel."
        placeholder="Fråga om läxan eller ett ord …"
      />
    </>
  );
}
