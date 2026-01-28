import { buildKieRequest } from "@/lib/kie-client";

describe("kie client", () => {
  it("builds a request payload", () => {
    const payload = buildKieRequest({
      prompt: "make it cinematic",
      imageUrl: "https://example.com/in.png",
    });

    expect(payload.prompt).toBe("make it cinematic");
  });
});
