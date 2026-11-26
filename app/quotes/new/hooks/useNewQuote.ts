import { useEffect, useState } from "react";

import { Customer } from "../../../types/customer";
import { Article } from "../../../types/article";
import { QuoteItem } from "../../../types/quote";

import {
  getCustomers,
  getArticles,
  createQuote,
} from "../../../services/quoteService";

import { round } from "../utils/round";

export function useNewQuote() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const [customerId, setCustomerId] = useState<number | "">("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<QuoteItem[]>([]);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [customersData, articlesData] = await Promise.all([
          getCustomers(),
          getArticles(),
        ]);

        setCustomers(customersData);
        setArticles(articlesData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Error al cargar clientes y artículos.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function addArticle() {
    if (!selectedArticle) return;

    const alreadyAdded = selectedArticles.some(
      (item) => item.articuloId === selectedArticle.id,
    );

    if (alreadyAdded) return;

    setSelectedArticles((current) => [
      ...current,
      {
        articuloId: selectedArticle.id,
        articuloCodigo: selectedArticle.codigo,
        articuloDescripcion: selectedArticle.descripcion,
        cantidad: 1,
        precioUnitario: selectedArticle.precioUnitario,
        descuentoPct: 0,
        alicuotaIva: selectedArticle.alicuotaIva,
        subtotalLinea: selectedArticle.precioUnitario,
      },
    ]);

    setSelectedArticle(null);
  }

  function updateArticle(
    articleId: number,
    field: "cantidad" | "descuentoPct",
    value: number,
  ) {
    setSelectedArticles((current) =>
      current.map((item) => {
        if (item.articuloId !== articleId) return item;

        const updatedItem = { ...item, [field]: value };

        const importeBruto = updatedItem.cantidad * updatedItem.precioUnitario;

        const descuento = importeBruto * (updatedItem.descuentoPct / 100);

        return {
          ...updatedItem,
          subtotalLinea: importeBruto - descuento,
        };
      }),
    );
  }

  function removeArticle(articleId: number) {
    setSelectedArticles((current) =>
      current.filter((item) => item.articuloId !== articleId),
    );
  }

  const totals = selectedArticles.reduce(
    (acc, item) => {
      const importeBruto = item.cantidad * item.precioUnitario;

      const descuento = importeBruto * (item.descuentoPct / 100);

      const subtotalLinea = importeBruto - descuento;

      const ivaLinea = round(subtotalLinea * (item.alicuotaIva / 100));

      return {
        descuento: acc.descuento + descuento,
        subtotal: acc.subtotal + subtotalLinea,
        iva: acc.iva + ivaLinea,
        total: acc.total + subtotalLinea + ivaLinea,
      };
    },
    {
      descuento: 0,
      subtotal: 0,
      iva: 0,
      total: 0,
    },
  );

  async function handleCreateQuote() {
    if (customerId === "") {
      setSubmitError("Seleccioná un cliente.");
      return;
    }

    if (selectedArticles.length === 0) {
      setSubmitError("Agregá al menos un artículo.");
      return;
    }

    setSaving(true);
    setSubmitError("");
    setSuccess("");

    try {
      await createQuote({
        clienteId: customerId,
        validezDias: 15,
        items: selectedArticles.map((item) => ({
          articuloId: item.articuloId,
          cantidad: item.cantidad,
          descuentoPct: item.descuentoPct,
        })),
      });

      setSuccess("Presupuesto creado correctamente.");
      setSelectedArticles([]);
      setCustomerId("");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Error al crear el presupuesto.",
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    customers,
    articles,
    customerId,
    setCustomerId,
    selectedArticle,
    setSelectedArticle,
    selectedArticles,
    saving,
    success,
    submitError,
    loading,
    error,
    addArticle,
    updateArticle,
    removeArticle,
    totals,
    handleCreateQuote,
  };
}
