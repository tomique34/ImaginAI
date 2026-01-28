import { render, screen } from "@testing-library/react";
import Providers from "@/app/providers";

describe("Providers", () => {
  it("renders children", () => {
    render(
      <Providers>
        <div>child content</div>
      </Providers>
    );

    expect(screen.getByText("child content")).toBeInTheDocument();
  });
});
