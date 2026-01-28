import { render, screen } from "@testing-library/react";
import ProjectEditor from "@/app/(dashboard)/project/[id]/page";

describe("Project Editor", () => {
  it("shows prompt input", () => {
    render(<ProjectEditor />);
    expect(screen.getByPlaceholderText(/prompt/i)).toBeInTheDocument();
  });
});
