import { Box, Divider, Typography } from "@mui/material";

import { formatCurrency } from "../../utils/formatCurrency";

interface QuoteSummaryProps {
  totals: {
    subtotal: number;
    descuento: number;
    iva: number;
    total: number;
  };
}

export function QuoteSummary({ totals }: QuoteSummaryProps) {
  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Resumen del presupuesto
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Subtotal bruto:</Typography>
        <Typography>
          {formatCurrency(totals.subtotal + totals.descuento)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Descuento:</Typography>
        <Typography color="error">
          - {formatCurrency(totals.descuento)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography>Subtotal con descuento:</Typography>
        <Typography>{formatCurrency(totals.subtotal)}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography>IVA:</Typography>
        <Typography>{formatCurrency(totals.iva)}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6" color="primary">
          {formatCurrency(totals.total)}
        </Typography>
      </Box>
    </Box>
  );
}
