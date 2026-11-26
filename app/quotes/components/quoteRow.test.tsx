import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import QuoteRow from "./quoteRow";

import { Quote } from "../../types/quote";

// Presupuesto ficticio para utilizar en las pruebas.
const mockQuote = {
  id: 1,
  numero: 100,
  fecha: "2026-11-26T00:00:00",
  clienteId: 1,
  clienteRazonSocial: "Cliente de prueba",
  estado: "Aprobado",
  validezDias: 15,
  items: [],
  subtotal: 1000,
  iva: 210,
  total: 1210,
} as Quote;

describe("QuoteRow", () => {
  it("muestra los datos del presupuesto", () => {
    // Renderizamos el componente con datos ficticios.
    render(
      <table>
        <tbody>
          <QuoteRow
            quote={mockQuote}
            isExpanded={false}
            invoicingId={null}
            duplicatingId={null}
            onExpand={vi.fn()}
            onInvoice={vi.fn()}
            onDuplicate={vi.fn()}
          />
        </tbody>
      </table>,
    );

    // Comprobamos que los datos aparecen en pantalla.
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Cliente de prueba")).toBeInTheDocument();
    expect(screen.getByText("Aprobado")).toBeInTheDocument();
  });

  it("ejecuta onExpand al hacer clic en la flechita", () => {
    // Creamos una función simulada para poder verificar si fue llamada.
    const onExpand = vi.fn();

    render(
      <table>
        <tbody>
          <QuoteRow
            quote={mockQuote}
            isExpanded={false}
            invoicingId={null}
            duplicatingId={null}
            onExpand={onExpand}
            onInvoice={vi.fn()}
            onDuplicate={vi.fn()}
          />
        </tbody>
      </table>,
    );

    // Buscamos la flechita por su aria-label y hacemos clic.
    screen
      .getByRole("button", {
        name: "Ver artículos del presupuesto",
      })
      .click();

    // Verificamos que onExpand recibió el ID del presupuesto.
    expect(onExpand).toHaveBeenCalledWith(1);
  });

  it("ejecuta onInvoice al hacer clic en Facturar", () => {
    const onInvoice = vi.fn();

    render(
      <table>
        <tbody>
          <QuoteRow
            quote={mockQuote}
            isExpanded={false}
            invoicingId={null}
            duplicatingId={null}
            onExpand={vi.fn()}
            onInvoice={onInvoice}
            onDuplicate={vi.fn()}
          />
        </tbody>
      </table>,
    );

    // Buscamos el botón por su texto y hacemos clic.
    screen.getByRole("button", { name: "Facturar" }).click();

    // Verificamos que se haya llamado con el ID del presupuesto.
    expect(onInvoice).toHaveBeenCalledWith(1);
  });

  it("no muestra el botón Facturar si el presupuesto está facturado", () => {
    // Creamos una copia del presupuesto con estado Facturado.
    const invoicedQuote = {
      ...mockQuote,
      estado: "Facturado",
    };

    render(
      <table>
        <tbody>
          <QuoteRow
            quote={invoicedQuote}
            isExpanded={false}
            invoicingId={null}
            duplicatingId={null}
            onExpand={vi.fn()}
            onInvoice={vi.fn()}
            onDuplicate={vi.fn()}
          />
        </tbody>
      </table>,
    );

    // El botón Facturar no debería existir.
    expect(
      screen.queryByRole("button", { name: "Facturar" }),
    ).not.toBeInTheDocument();
  });

  it("ejecuta onDuplicate al hacer clic en Duplicar", () => {
    const onDuplicate = vi.fn();

    render(
      <table>
        <tbody>
          <QuoteRow
            quote={mockQuote}
            isExpanded={false}
            invoicingId={null}
            duplicatingId={null}
            onExpand={vi.fn()}
            onInvoice={vi.fn()}
            onDuplicate={onDuplicate}
          />
        </tbody>
      </table>,
    );

    screen.getByRole("button", { name: "Duplicar" }).click();

    expect(onDuplicate).toHaveBeenCalledWith(1);
  });

  it("deshabilita los botones mientras se factura un presupuesto", () => {
    render(
      <table>
        <tbody>
          <QuoteRow
            quote={mockQuote}
            isExpanded={false}
            invoicingId={1}
            duplicatingId={null}
            onExpand={vi.fn()}
            onInvoice={vi.fn()}
            onDuplicate={vi.fn()}
          />
        </tbody>
      </table>,
    );

    // Ambos botones deben estar deshabilitados.
    expect(screen.getByRole("button", { name: "Duplicar" })).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Facturando..." }),
    ).toBeDisabled();
  });

  it("deshabilita los botones mientras se duplica un presupuesto", () => {
    render(
      <table>
        <tbody>
          <QuoteRow
            quote={mockQuote}
            isExpanded={false}
            invoicingId={null}
            duplicatingId={1}
            onExpand={vi.fn()}
            onInvoice={vi.fn()}
            onDuplicate={vi.fn()}
          />
        </tbody>
      </table>,
    );

    expect(
      screen.getByRole("button", { name: "Duplicando..." }),
    ).toBeDisabled();

    expect(screen.getByRole("button", { name: "Facturar" })).toBeDisabled();
  });
});
