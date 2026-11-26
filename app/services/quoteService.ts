import { Quote } from "../types/quote";
import { Customer } from "../types/customer";
import { Article } from "../types/article";

export async function getQuotes(): Promise<Quote[]> {
  const response = await fetch(`/api/Presupuestos`);

  if (!response.ok) {
    throw new Error("Failed to fetch quotes");
  }

  return response.json();
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch("/api/Clientes");

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  return response.json();
}

export async function getArticles(): Promise<Article[]> {
  const response = await fetch("/api/Articulos");

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return response.json();
}

export async function createQuote(data: {
  clienteId: number;
  validezDias: number;
  items: {
    articuloId: number;
    cantidad: number;
    descuentoPct: number;
  }[];
}): Promise<void> {
  const response = await fetch("/api/Presupuestos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Error al crear el presupuesto.");
  }
}

export async function facturarPresupuesto(
  presupuestoId: number,
): Promise<void> {
  const response = await fetch(`/api/Facturas/facturar/${presupuestoId}`, {
    method: "POST",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "No se pudo facturar el presupuesto.");
  }
}

export async function duplicateQuote(presupuestoId: number): Promise<void> {
  // No necesitamos enviar un body porque el backend obtiene todos los datos del presupuesto original.
  const response = await fetch(`/api/Presupuestos/${presupuestoId}/duplicar`, {
    method: "POST",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "No se pudo duplicar el presupuesto.");
  }
}
