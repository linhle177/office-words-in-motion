import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/Page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hikidashi — Work English, learned in ready-to-use phrases" },
      {
        name: "description",
        content:
          "Hikidashi teaches you new work phrases, then has you practice them until you can actively use them at work. Download the app.",
      },
      { property: "og:title", content: "Hikidashi — Don't let English hold you back at work" },
      {
        property: "og:description",
        content:
          "An app that teaches you new work phrases, then has you practice them until you can actively use them at work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <LandingPage />;
}
