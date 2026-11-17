import PageHeading from "@/components/page-heading";
import StudioBoard from "@/components/studio-board";

export const metadata = { title: "Studion · Elda Skola 2.0" };

export default function StudionPage() {
  return (
    <>
      <PageHeading
        kicker="Plugg och resultat"
        title="Studion"
        description="Här jobbar du med uppgifter och ser dina tidigare resultat. Maskoten till vänster följer varje svar."
      />

      <StudioBoard />
    </>
  );
}
