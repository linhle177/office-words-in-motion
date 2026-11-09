import { describe, expect, it } from "vitest";

import { checkAnswer } from "@/components/landing/practice";

describe("practice card grading", () => {
  it("accepts the phrase 'push back the deadline'", () => {
    expect(checkAnswer("Could we push back the deadline?")).toBe("exact");
  });

  it("accepts the split form 'push the deadline back'", () => {
    expect(checkAnswer("can we push the deadline back to Monday")).toBe("exact");
  });

  it("marks a different way of asking for time as close", () => {
    expect(checkAnswer("We should postpone the launch.")).toBe("close");
  });

  it("marks an unrelated or empty reply as a miss", () => {
    expect(checkAnswer("Sounds good!")).toBe("miss");
    expect(checkAnswer("   ")).toBe("miss");
  });
});
