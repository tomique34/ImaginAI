import { buildProjectImagePath } from "@/lib/storage";

describe("storage", () => {
  it("creates a stable storage path", () => {
    expect(buildProjectImagePath("u1", "p1", "file.png")).toBe("u1/p1/file.png");
  });
});
