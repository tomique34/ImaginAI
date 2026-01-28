/** @jest-environment node */
import { POST } from "@/app/api/jobs/route";
import { startKieJob } from "@/lib/kie-client";

const profileSelectMock = jest.fn();
const profileEqMock = jest.fn();
const profileSingleMock = jest.fn();
const updateMock = jest.fn();
const updateEqMock = jest.fn();
const insertMock = jest.fn();
const insertSelectMock = jest.fn();
const insertSingleMock = jest.fn();
const fromMock = jest.fn();

jest.mock("@/lib/supabase/server", () => ({
  createServerClient: () => ({
    from: fromMock,
  }),
}));

jest.mock("@/lib/kie-client", () => ({
  startKieJob: jest.fn(),
}));

describe("jobs api", () => {
  beforeEach(() => {
    fromMock.mockImplementation((table: string) => {
      if (table === "profiles") {
        return {
          select: profileSelectMock,
          update: updateMock,
        };
      }
      if (table === "job_history") {
        return {
          insert: insertMock,
        };
      }
      return {};
    });

    profileSelectMock.mockReturnValue({ eq: profileEqMock });
    profileEqMock.mockReturnValue({ single: profileSingleMock });
    profileSingleMock.mockResolvedValue({
      data: { credits_balance: 3 },
      error: null,
    });

    updateMock.mockReturnValue({ eq: updateEqMock });
    updateEqMock.mockResolvedValue({ data: null, error: null });

    insertMock.mockReturnValue({ select: insertSelectMock });
    insertSelectMock.mockReturnValue({ single: insertSingleMock });
    insertSingleMock.mockResolvedValue({ data: { id: "job-1" }, error: null });

    (startKieJob as jest.Mock).mockResolvedValue({ job_id: "remote-1" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates a job and returns job id", async () => {
    const request = new Request("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        userId: "u1",
        projectId: "p1",
        prompt: "make it cinematic",
        imageUrl: "https://example.com/in.png",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.jobId).toBe("job-1");
    expect(startKieJob).toHaveBeenCalled();
  });

  it("rejects when credits are insufficient", async () => {
    profileSingleMock.mockResolvedValue({
      data: { credits_balance: 0 },
      error: null,
    });

    const request = new Request("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        userId: "u1",
        projectId: "p1",
        prompt: "make it cinematic",
        imageUrl: "https://example.com/in.png",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(402);
    expect(startKieJob).not.toHaveBeenCalled();
  });
});
