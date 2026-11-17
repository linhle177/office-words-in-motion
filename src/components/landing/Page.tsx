import { MotionConfig } from "motion/react";

import { Nav, ScrollProgress } from "./Chrome";
import { Closing } from "./Closing";
import { CopyProvider, EN, type Copy } from "./copy";
import { EarlyAccessProvider } from "./EarlyAccess";
import { Hero } from "./Hero";
import { Method } from "./Method";
import { Paradox } from "./Paradox";
import { Reasons } from "./Reasons";

/** The whole landing page in one language. Routes pick the copy bundle. */
export function LandingPage({ copy = EN }: { copy?: Copy }) {
  return (
    <CopyProvider value={copy}>
      <MotionConfig reducedMotion="user">
        <EarlyAccessProvider>
          <ScrollProgress />
          <Nav />
          <main lang={copy.lang} className="overflow-x-clip">
            <Hero />
            <Paradox />
            <Reasons />
            <Method />
            <Closing />
          </main>
        </EarlyAccessProvider>
      </MotionConfig>
    </CopyProvider>
  );
}
