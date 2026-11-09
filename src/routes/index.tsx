import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";

import { Nav, ScrollProgress } from "@/components/landing/Chrome";
import { Closing } from "@/components/landing/Closing";
import { EarlyAccessProvider } from "@/components/landing/EarlyAccess";
import { Hero } from "@/components/landing/Hero";
import { Method } from "@/components/landing/Method";
import { Paradox } from "@/components/landing/Paradox";
import { Reasons } from "@/components/landing/Reasons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hikidashi — Work English, learned in ready-to-use phrases" },
      {
        name: "description",
        content:
          "Hikidashi teaches you new work phrases, then has you practice them until you can actively use them at work. Download the app.",
      },
      { property: "og:title", content: "Hikidashi — Have your English vocabulary ready the moment you need it" },
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
  return (
    <MotionConfig reducedMotion="user">
      <EarlyAccessProvider>
        <ScrollProgress />
        <Nav />
        <main className="overflow-x-clip">
          <Hero />
          <Paradox />
          <Reasons />
          <Method />
          <Closing />
        </main>
      </EarlyAccessProvider>
    </MotionConfig>
  );
}
