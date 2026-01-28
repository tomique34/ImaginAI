import { render, screen } from "@testing-library/react";
import AdminProducts from "@/app/(admin)/admin/products/page";

describe("Admin Products", () => {
  it("shows products table", () => {
    render(<AdminProducts />);
    expect(screen.getByText(/products/i)).toBeInTheDocument();
  });
});
