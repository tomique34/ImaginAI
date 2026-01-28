import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";

describe("Login", () => {
  it("renders google login action", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("button", { name: /continue with google/i })
    ).toBeInTheDocument();
  });
});
