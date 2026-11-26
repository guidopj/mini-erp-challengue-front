import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import QuoteItems from "./quoteItems";

import { Quote } from "../../types/quote";

// Presupuesto ficticio con un artículo.
const mockQuote = {
  id: 1,
  numero: 100,
  items: [
    {
      articuloId: 10,
      articuloCodigo: "ART-001",
      articuloDescripcion: "Teclado mecánico",
      cantidad: 2,
      precioUnitario: 10000,
      descuentoPct: 10,
      alicuotaIva: 21,
      subtotalLinea: 18000,
    },
  ],
} as Quote;

describe("QuoteItems", () => {
  it("muestra los datos de los artículos del presupuesto", () => {
    render(<QuoteItems quote={mockQuote} />);

    // Verificamos que aparezcan los datos del artículo.
    expect(screen.getByText("ART-001")).toBeInTheDocument();
    expect(screen.getByText("Teclado mecánico")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("21%")).toBeInTheDocument();
  });
});
