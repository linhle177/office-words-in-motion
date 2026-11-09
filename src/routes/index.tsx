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
          "Hikidashi teaches the work phrases you're missing, turns the words you already know into phrases, and has you practice saying them. Download the app.",
      },
      { property: "og:title", content: "Hikidashi — Find the right English in the meeting, not after it" },
      {
        property: "og:description",
        content:
          "An app that teaches the workplace phrases you're missing, turns the words you know into phrases, and has you practice saying them out loud.",
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
