import { render, screen } from "@testing-library/react";
import Billing from "@/app/(dashboard)/billing/page";

describe("Billing", () => {
  it("shows pricing options", () => {
    render(<Billing />);
    expect(screen.getByText(/starter/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /buy credits/i }).length
    ).toBeGreaterThan(0);
  });
});
