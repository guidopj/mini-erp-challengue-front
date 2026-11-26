import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import QuoteTable from "./quoteTable";
import { Quote } from "../../types/quote";

// Presupuestos ficticios para utilizar en las pruebas.
const mockQuotes = [
  {
    id: 1,
    numero: 100,
    fecha: "2026-11-26T00:00:00",
    clienteId: 1,
    clienteRazonSocial: "Cliente A",
    estado: "Aprobado",
    validezDias: 15,
    items: [],
    subtotal: 1000,
    iva: 210,
    total: 1210,
  },
  {
    id: 2,
    numero: 101,
    fecha: "2026-11-26T00:00:00",
    clienteId: 2,
    clienteRazonSocial: "Cliente B",
    estado: "Facturado",
    validezDias: 15,
    items: [],
    subtotal: 2000,
    iva: 420,
    total: 2420,
  },
] as Quote[];

// Función auxiliar para renderizar la tabla.
// Recibe una lista de presupuestos y utiliza funciones simuladas
// para los callbacks que necesita QuoteTable.
function renderQuoteTable(quotes: Quote[] = mockQuotes) {
  return render(
    <QuoteTable
      quotes={quotes}
      invoicingId={null}
      duplicatingId={null}
      expandedId={null}
      onExpand={vi.fn()}
      onInvoice={vi.fn()}
      onDuplicate={vi.fn()}
    />,
  );
}

describe("QuoteTable", () => {
  // Comprueba que se muestren todos los presupuestos recibidos.
  it("muestra todos los presupuestos", () => {
    renderQuoteTable();

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("101")).toBeInTheDocument();

    expect(screen.getByText("Cliente A")).toBeInTheDocument();
    expect(screen.getByText("Cliente B")).toBeInTheDocument();
  });

  // Comprueba que se muestren los encabezados de la tabla.
  it("muestra los encabezados de la tabla", () => {
    renderQuoteTable();

    expect(screen.getByText("Número")).toBeInTheDocument();
    expect(screen.getByText("Fecha")).toBeInTheDocument();
    expect(screen.getByText("Cliente")).toBeInTheDocument();
    expect(screen.getByText("Estado")).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("IVA")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();
  });

  // Comprueba que aparezca un mensaje cuando la lista está vacía.
  it("muestra un mensaje cuando no hay presupuestos", () => {
    renderQuoteTable([]);

    expect(
      screen.getByText("No hay presupuestos registrados."),
    ).toBeInTheDocument();
  });

  // Comprueba que solamente aparezca Facturar
  // para los presupuestos que todavía no están facturados.
  it("muestra Facturar solamente para presupuestos no facturados", () => {
    renderQuoteTable();

    // Tenemos dos presupuestos:
    // uno Aprobado y otro Facturado.
    // Por lo tanto, solamente debe aparecer un botón Facturar.
    expect(screen.getAllByRole("button", { name: "Facturar" })).toHaveLength(1);
  });
});
