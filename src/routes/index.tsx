import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";

import { LearnedCounter, Nav, ScrollProgress } from "@/components/landing/Chrome";
import { Closing } from "@/components/landing/Closing";
import { Fields } from "@/components/landing/Fields";
import { FlashDeck } from "@/components/landing/FlashDeck";
import { Hero } from "@/components/landing/Hero";
import { LearnedProvider } from "@/components/landing/learned";
import { Manifesto } from "@/components/landing/Manifesto";
import { MeetingScene } from "@/components/landing/MeetingScene";
import { Quote, Stats } from "@/components/landing/Proof";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wordwork — Speak the language of work" },
      {
        name: "description",
        content:
          "Workplace English vocabulary, five words a day. Learn the phrases your meetings, emails and Slack threads actually use.",
      },
      { property: "og:title", content: "Wordwork — Speak the language of work" },
      {
        property: "og:description",
        content: "Workplace English vocabulary, five words a day. Sound like you run the meeting.",
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
      <LearnedProvider>
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <MeetingScene />
          <Manifesto />
          <FlashDeck />
          <Fields />
          <Stats />
          <Quote />
          <Closing />
        </main>
        <LearnedCounter />
      </LearnedProvider>
    </MotionConfig>
  );
}
