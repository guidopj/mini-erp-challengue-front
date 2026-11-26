import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { useNewQuote } from "./useNewQuote";

import {
  getCustomers,
  getArticles,
  createQuote,
} from "../../../services/quoteService";

import { Customer } from "../../../types/customer";
import { Article } from "../../../types/article";

// Simulamos los servicios para no depender de la API ni de la base de datos.
// En estos tests queremos probar la lógica del hook, no las llamadas HTTP.
vi.mock("../../../services/quoteService", () => ({
  getCustomers: vi.fn(),
  getArticles: vi.fn(),
  createQuote: vi.fn(),
}));

// Datos ficticios que utilizaremos durante las pruebas.
const mockCustomer = {
  id: 1,
  razonSocial: "Cliente de prueba",
} as Customer;

const mockArticle = {
  id: 10,
  codigo: "ART001",
  descripcion: "Artículo de prueba",
  precioUnitario: 1000,
  alicuotaIva: 21,
} as Article;

// Renderiza el hook y espera a que termine de cargar los datos iniciales.
// Equivale a preparar la pantalla de nuevo presupuesto antes de probarla.
async function setup() {
  const hook = renderHook(() => useNewQuote());

  // Esperamos a que loading cambie a false.
  await waitFor(() => {
    expect(hook.result.current.loading).toBe(false);
  });

  return hook;
}

// Función auxiliar para seleccionar y agregar un artículo.
// La reutilizamos porque varios tests necesitan realizar esta operación.
async function addMockArticle(result: {
  current: ReturnType<typeof useNewQuote>;
}) {
  // Primero seleccionamos el artículo.
  act(() => {
    result.current.setSelectedArticle(mockArticle);
  });

  // Después lo agregamos a la lista.
  // Separamos ambos act porque React necesita aplicar la actualización
  // del estado antes de ejecutar addArticle().
  act(() => {
    result.current.addArticle();
  });
}

describe("useNewQuote", () => {
  // Se ejecuta antes de cada test.
  // Dejamos los mocks limpios y configuramos sus respuestas ficticias.
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getCustomers).mockResolvedValue([mockCustomer]);
    vi.mocked(getArticles).mockResolvedValue([mockArticle]);
    vi.mocked(createQuote).mockResolvedValue(undefined);
  });

  // Comprueba que el hook obtiene correctamente los clientes y artículos.
  it("carga los clientes y artículos", async () => {
    const { result } = await setup();

    expect(result.current.customers).toEqual([mockCustomer]);
    expect(result.current.articles).toEqual([mockArticle]);
    expect(result.current.loading).toBe(false);
  });

  // Comprueba que podemos agregar un artículo a un presupuesto.
  it("agrega un artículo seleccionado", async () => {
    const { result } = await setup();

    await addMockArticle(result);

    // Verificamos que haya exactamente un artículo.
    expect(result.current.selectedArticles).toHaveLength(1);

    // Verificamos que sus datos iniciales sean correctos.
    expect(result.current.selectedArticles[0]).toMatchObject({
      articuloId: 10,
      cantidad: 1,
      precioUnitario: 1000,
      descuentoPct: 0,
      subtotalLinea: 1000,
    });

    // Después de agregarlo, el selector debe quedar vacío.
    expect(result.current.selectedArticle).toBeNull();
  });

  // Comprueba que no se pueda agregar dos veces el mismo artículo.
  it("no permite agregar dos veces el mismo artículo", async () => {
    const { result } = await setup();

    // Primera incorporación.
    await addMockArticle(result);

    expect(result.current.selectedArticles).toHaveLength(1);

    // Intentamos agregar nuevamente el mismo artículo.
    await addMockArticle(result);

    // La cantidad de artículos debe seguir siendo uno.
    expect(result.current.selectedArticles).toHaveLength(1);
  });

  // Comprueba que se actualicen correctamente la cantidad y el descuento.
  it("actualiza la cantidad y el descuento de un artículo", async () => {
    const { result } = await setup();

    await addMockArticle(result);

    // Cambiamos la cantidad de 1 a 2.
    act(() => {
      result.current.updateArticle(10, "cantidad", 2);
    });

    // Aplicamos un descuento del 10%.
    act(() => {
      result.current.updateArticle(10, "descuentoPct", 10);
    });

    // 2 x 1000 = 2000
    // 2000 - 10% = 1800
    expect(result.current.selectedArticles[0]).toMatchObject({
      cantidad: 2,
      descuentoPct: 10,
      subtotalLinea: 1800,
    });
  });

  // Comprueba que el hook calcule correctamente todos los importes.
  it("calcula correctamente subtotal, descuento, IVA y total", async () => {
    const { result } = await setup();

    await addMockArticle(result);

    // Dos unidades del artículo.
    act(() => {
      result.current.updateArticle(10, "cantidad", 2);
    });

    // Descuento del 10%.
    act(() => {
      result.current.updateArticle(10, "descuentoPct", 10);
    });

    // Importe bruto: 2000
    // Descuento: 200
    // Subtotal: 1800
    // IVA (21%): 378
    // Total: 2178
    expect(result.current.totals).toEqual({
      descuento: 200,
      subtotal: 1800,
      iva: 378,
      total: 2178,
    });
  });

  // Comprueba que se pueda quitar un artículo del presupuesto.
  it("elimina un artículo seleccionado", async () => {
    const { result } = await setup();

    await addMockArticle(result);

    act(() => {
      result.current.removeArticle(10);
    });

    expect(result.current.selectedArticles).toHaveLength(0);
  });

  // Comprueba que no se pueda crear un presupuesto sin seleccionar un cliente.
  it("no crea un presupuesto si no hay un cliente seleccionado", async () => {
    const { result } = await setup();

    await act(async () => {
      await result.current.handleCreateQuote();
    });

    // Debe mostrar el mensaje de validación.
    expect(result.current.submitError).toBe("Seleccioná un cliente.");

    // El servicio de creación no debe ejecutarse.
    expect(createQuote).not.toHaveBeenCalled();
  });

  // Comprueba que no se pueda crear un presupuesto sin artículos.
  it("no crea un presupuesto si no hay artículos", async () => {
    const { result } = await setup();

    // Seleccionamos un cliente, pero no agregamos artículos.
    act(() => {
      result.current.setCustomerId(1);
    });

    await act(async () => {
      await result.current.handleCreateQuote();
    });

    expect(result.current.submitError).toBe("Agregá al menos un artículo.");
    expect(createQuote).not.toHaveBeenCalled();
  });

  // Comprueba el flujo completo de creación de un presupuesto.
  it("crea un presupuesto con los datos seleccionados", async () => {
    const { result } = await setup();

    // Seleccionamos un cliente.
    act(() => {
      result.current.setCustomerId(1);
    });

    // Agregamos un artículo.
    await addMockArticle(result);

    // Configuramos cantidad y descuento.
    act(() => {
      result.current.updateArticle(10, "cantidad", 2);
      result.current.updateArticle(10, "descuentoPct", 10);
    });

    // Ejecutamos la creación del presupuesto.
    await act(async () => {
      await result.current.handleCreateQuote();
    });

    // Comprobamos que createQuote haya recibido los datos correctos.
    // No verificamos una llamada HTTP real porque el servicio está simulado.
    expect(createQuote).toHaveBeenCalledWith({
      clienteId: 1,
      validezDias: 15,
      items: [
        {
          articuloId: 10,
          cantidad: 2,
          descuentoPct: 10,
        },
      ],
    });

    // Verificamos que el hook informe que se creó correctamente.
    expect(result.current.success).toBe("Presupuesto creado correctamente.");

    // Después de crear el presupuesto, el formulario se limpia.
    expect(result.current.selectedArticles).toHaveLength(0);
    expect(result.current.customerId).toBe("");
  });
});
