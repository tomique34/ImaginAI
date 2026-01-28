import { render, screen } from "@testing-library/react";
import Dashboard from "@/app/(dashboard)/dashboard/page";

describe("Dashboard", () => {
  it("shows credit balance", () => {
    render(<Dashboard />);
    expect(screen.getByText(/credits/i)).toBeInTheDocument();
  });
});
