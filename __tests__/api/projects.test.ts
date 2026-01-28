/** @jest-environment node */
import { POST } from "@/app/api/projects/route";

const insertMock = jest.fn();
const selectMock = jest.fn();
const singleMock = jest.fn();
const fromMock = jest.fn();

jest.mock("@/lib/supabase/server", () => ({
  createServerClient: () => ({
    from: fromMock,
  }),
}));

describe("projects api", () => {
  beforeEach(() => {
    fromMock.mockReturnValue({
      insert: insertMock,
    });
    insertMock.mockReturnValue({
      select: selectMock,
    });
    selectMock.mockReturnValue({
      single: singleMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates a project", async () => {
    singleMock.mockResolvedValue({
      data: { id: "p1" },
      error: null,
    });

    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        userId: "u1",
        name: "Test Project",
        originalImageUrl: "https://example.com/img.png",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.id).toBe("p1");
  });
});
