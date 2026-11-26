"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Alert,
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import {
  getQuotes,
  facturarPresupuesto,
  duplicateQuote,
} from "../services/quoteService";
import { Quote } from "../types/quote";
import QuoteTable from "./components/quoteTable";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [facturandoId, setFacturandoId] = useState<number | null>(null);
  const [duplicandoId, setDuplicandoId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function cargarPresupuestos() {
    try {
      setLoading(true);
      const data = await getQuotes();
      setQuotes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los presupuestos.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  async function handleFacturar(presupuestoId: number) {
    try {
      setError("");
      setFacturandoId(presupuestoId);

      await facturarPresupuesto(presupuestoId);
      await cargarPresupuestos();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo facturar el presupuesto.",
      );
    } finally {
      setFacturandoId(null);
    }
  }

  async function handleDuplicar(presupuestoId: number) {
    try {
      setError("");
      setDuplicandoId(presupuestoId);

      await duplicateQuote(presupuestoId);
      await cargarPresupuestos();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo duplicar el presupuesto.",
      );
    } finally {
      setDuplicandoId(null);
    }
  }

  function handleExpandir(presupuestoId: number) {
    setExpandedId((currentId) =>
      currentId === presupuestoId ? null : presupuestoId,
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{ py: 4, width: "100%", px: { xs: 1, sm: 2 } }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Presupuestos
        </Typography>

        <Link href="/quotes/new" passHref style={{ textDecoration: "none" }}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nuevo presupuesto
          </Button>
        </Link>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <QuoteTable
          quotes={quotes}
          facturandoId={facturandoId}
          duplicandoId={duplicandoId}
          expandedId={expandedId}
          onExpandir={handleExpandir}
          onFacturar={handleFacturar}
          onDuplicar={handleDuplicar}
        />
      )}
    </Container>
  );
}
