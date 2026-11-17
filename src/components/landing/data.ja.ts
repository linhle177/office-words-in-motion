/**
 * Japanese landing copy for Hikidashi (served at /ja).
 * Transcreated from data.ts, not translated word for word. Source: hikidashi-lp-copy-ja-v9.
 * The English the visitor is learning (push back the deadline, the manager's line) stays in English.
 * Voice: です・ます, calm, no あなた. Needs a read-through by Japanese office workers before ads.
 */
import type { Copy } from "./copy";
import { EN } from "./copy";

/**
 * Display headings use word-break: keep-all, so Japanese only wraps where we allow it.
 * "|" marks a phrase boundary where a line may break (becomes a zero-width space).
 */
const b = (s: string) => s.replaceAll("|", "\u200B");

export const JA: Copy = {
  lang: "ja",
  brand: { name: "Hikidashi", kanji: "引き出し" },

  dict: {
    head: "ひきだし",
    kanji: "【引き出し】",
    pos: "名",
    sense: "② 必要なときに取り出せる、知識や経験のたくわえ。「英語の―を増やす」",
  },

  nav: {
    links: [
      { href: "#paradox", label: "知っているのに" },
      { href: "#reasons", label: "出てこない理由" },
      { href: "#method", label: "しくみ" },
    ],
    cta: "アプリをダウンロード",
  },

  /* ── Hero ── */
  hero: {
    eyebrow: "仕事で使う英語を、フレーズで覚える",
    lineOne: ["", "英語", "が、"],
    lineTwo: "仕事の足を",
    late: "引っ張らないように。",
    subhead:
      "Hikidashiは、仕事で使う英語フレーズを覚えて、自分で使えるようになるまで練習するアプリです。",
    cta: "アプリをダウンロード",
  },

  /* ── § 01 ── */
  paradox: {
    // 3,000 is a working assumption (old 学習指導要領) — confirm before launch.
    words: { value: 3000, unit: "語", caption: "中学・高校の6年間で習う英単語の数。" },
    speak: {
      value: 19.7,
      caption: "「英語を話せる」と答えた、日本の英語学習者の割合。",
      source: "IIBC（2026年）",
    },
    footnote: {
      figure: "61%",
      text: "英語力を伸ばしたい社会人のうち、英語が原因で仕事に困ったことがある人の割合。",
      source: "ECC（2026年）",
    },
  },

  /* ── § 02 ── */
  reasons: {
    headlineA: b("単語のほとんどは、|もう|頭の中に|ある。"),
    headlineB: ["それでも", "出てこない", b("のには、|2つの|理由が|あります。")],
    one: {
      title: b("単語を、|1つずつ|覚えてきたから。"),
      // 「約半分」 is a working assumption — confirm before launch.
      body: "でも、日常の英語の約半分は、決まったフレーズでできています。話せる人は「{push back the deadline}」をひとかたまりで取り出します。1語ずつ組み立てているうちに、会話は先へ進んでしまいます。",
    },
    two: {
      title: b("学校や|試験で、|「使う」より|「見てわかる」|ための|覚え方を|してきたから。"),
      body: "TOEICや英検®、TOEFLの対策は、4択から正解を選ぶ問題が中心です。でも話すときは、3秒ほどで自分で言葉を探し出さなければなりません。頭が真っ白になるのは、この瞬間です。",
      stat: {
        lead: "約3人に1人",
        text: "が、「とっさに言葉が出てこない」と答えています。",
        source: "IIBC（2026年）・日本の英語学習者が対象",
      },
      epi: { label: "日本（EF EPI 2025）", reading: 454, speaking: 393 },
    },
  },

  phrase: EN.phrase,

  recall: {
    ...EN.recall,
    blank: b("頭が、|真っ白に。"),
    hold: "長押しして、声に出して答える",
    holding: "そのまま長押し…言葉を探して",
  },

  /* ── § 03 ── */
  method: {
    headline: b("Hikidashiは、|その両方に|取り組みます。"),
    noteLead: "",
    note: "すぐ使えるフレーズを「引き出し」にしまっておき、必要なときにさっと取り出す。",
    steps: [
      {
        reason: 1,
        title: b("単語ではなく、|フレーズで|覚える。"),
        body: "仕事でよくある場面のフレーズを、新しく覚えます。ほとんどが、もう知っている単語でできています。「deadline」だけでなく、「{push back the deadline}」まで。",
      },
      {
        reason: 2,
        title: b("自分で|思い出す|練習をする。"),
        body: "1行だけ空いた仕事の場面に、入力か声で答えます。選択肢はありません。",
      },
      {
        reason: 2,
        title: b("忘れかけたころに、|もう一度。"),
        body: "復習のタイミングは、Hikidashiにお任せ。",
        curve: true,
      },
    ],
  },

  practice: {
    ...EN.practice,
    tag: "練習・シーン14",
    scene: "定例ミーティング・火 10:00",
    speaker: "上司",
    lineGloss: "クライアントから画面が2つ追加。金曜リリース、まだいけそう？",
    hint: "ひとことで、期限を延ばせないか聞いてみましょう。",
    schedule: ["今日", "2日後", "6日後", "2週間後", "1か月後"],
  },

  /* ── § 04 ── */
  closing: {
    headline: [b("次の会議までに、|使える|英語を"), "「引き出し」", "に。"],
    // 5 minutes a day must match the real app — confirm before launch.
    body: "仕事で使う英語フレーズを覚えて、使えるようになるまで練習。通勤中のスキマ時間に、1日5分。",
  },

  earlyAccess: {
    headline: b("Hikidashiは、|まだ|リリース前です。"),
    body: "お待たせしてすみません。現在、開発を進めています。メールアドレスをご登録いただくと、リリース時に一度だけお知らせします。",
    placeholder: "メールアドレス",
    cta: "お知らせを受け取る",
    done: b("登録が完了しました。|リリース当日に、|メールで|一度だけ|お知らせします。"),
    consent:
      "登録無料・お知らせはリリース時の1回だけ・勧誘は一切ありません。ご登録により、Hikidashiからのリリースのお知らせの受信に同意したものとみなします。",
  },

  ui: {
    scroll: "スクロール",
    sections: {
      paradox: "§ 01 — 知っているのに、話せない",
      reasons: "§ 02 — 出てこない2つの理由",
      method: "§ 03 — Hikidashi",
      closing: "§ 04 — ダウンロード",
    },
    reason: "理由",
    assembly: { slow: "1語ずつ", fast: "フレーズで" },
    recall: { reading: "読む", recognized: "見ればわかる ✓", speaking: "話す" },
    epi: { reading: "リーディング", speaking: "スピーキング" },
    practice: {
      you: "自分",
      placeholder: "ここに英語で答える",
      check: "答え合わせ",
      say: "声で答える",
      listening: "聞き取り中…タップで停止",
      showMe: "答えを見る",
      tryAgain: "↺ もう一度",
      hint: "ヒント",
      review: "復習",
      verdict: {
        exact: "正解。このフレーズです。",
        close: "おしい。話せる人なら、こう言います",
        miss: "答えの例",
        reveal: "答えの例",
      },
    },
    stores: {
      apple: { small: "App Storeから", big: "ダウンロード", label: "App Storeからダウンロード" },
      google: { small: "Google Play で", big: "手に入れよう", label: "Google Play で手に入れよう" },
    },
    footer: { privacy: "プライバシーポリシー", terms: "利用規約", top: "ページの先頭へ ↑" },
    earlyAccess: {
      label: "事前登録",
      close: "閉じる",
      email: "メールアドレス",
      error: "メールアドレスをご確認ください（例：name@example.com）",
    },
  },
};
