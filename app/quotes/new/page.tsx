"use client";

import Link from "next/link";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNewQuote } from "./hooks/useNewQuote";
import { CustomerSelect } from "./components/customerSelect";
import { ArticleSelector } from "./components/articleSelector";
import { SelectedArticles } from "./components/selectedArticles";
import { QuoteSummary } from "./components/quoteSummary";

export default function NewQuotePage() {
  const {
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
  } = useNewQuote();

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        component={Link}
        href="/quotes"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>
      <Typography variant="h4" gutterBottom>
        Nuevo presupuesto
      </Typography>

      <CustomerSelect
        customers={customers}
        customerId={customerId}
        onChange={setCustomerId}
      />

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Artículos
      </Typography>

      <ArticleSelector
        articles={articles}
        selectedArticle={selectedArticle}
        onSelect={setSelectedArticle}
        onAdd={addArticle}
      />

      <Typography variant="h6" sx={{ mt: 4 }}>
        Artículos agregados
      </Typography>

      <SelectedArticles
        selectedArticles={selectedArticles}
        onUpdate={updateArticle}
        onRemove={removeArticle}
      />

      {selectedArticles.length > 0 && <QuoteSummary totals={totals} />}

      {submitError && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {submitError}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {success}
        </Alert>
      )}

      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{ mt: 3 }}
        onClick={handleCreateQuote}
        disabled={saving || selectedArticles.length === 0 || customerId === ""}
      >
        {saving ? "Creando presupuesto..." : "Crear presupuesto"}
      </Button>
    </Container>
  );
}
