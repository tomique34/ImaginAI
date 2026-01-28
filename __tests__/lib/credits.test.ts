import { applyCreditDebit } from "@/lib/credits";

describe("credits", () => {
  it("deducts credits safely", () => {
    expect(applyCreditDebit(3, 1)).toBe(2);
  });
});
