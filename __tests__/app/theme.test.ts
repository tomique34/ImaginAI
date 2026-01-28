import { theme } from "@/app/theme";

describe("theme", () => {
  it("uses the project font tokens", () => {
    expect(theme.typography.fontFamily).toBe("var(--font-text)");
    expect(theme.typography.h1?.fontFamily).toBe("var(--font-display)");
  });
});
