import { createFileRoute } from "@tanstack/react-router";

import { JA } from "@/components/landing/data.ja";
import { LandingPage } from "@/components/landing/Page";

const TITLE = "ビジネス英語アプリHikidashi｜仕事の英語を、フレーズで";
const DESCRIPTION =
  "単語は知っているのに、会議で英語が出てこない。Hikidashiは、仕事で使う英語フレーズ・熟語を覚えて、自分で使えるようになるまで練習するビジネス英語アプリです。通勤中のスキマ時間に、1日5分。";

/** Japanese landing page. Same layout as /, copy from data.ja.ts. */
export const Route = createFileRoute("/ja")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ja_JP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300..600&family=Noto+Serif+JP:wght@400;500&display=swap",
      },
    ],
  }),
  component: JapanesePage,
});

function JapanesePage() {
  return <LandingPage copy={JA} />;
}
