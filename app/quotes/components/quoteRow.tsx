import {
  TableRow,
  TableCell,
  Chip,
  Button,
  Box,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { Quote } from "../../types/quote";
import { formatCurrency } from "../utils/formatCurrency";
import QuoteItems from "./quoteItems";

interface QuoteRowProps {
  quote: Quote;
  isExpanded: boolean;
  invoicingId: number | null;
  duplicatingId: number | null;
  onExpand: (id: number) => void;
  onInvoice: (id: number) => void;
  onDuplicate: (id: number) => void;
}

const estadoColors: Record<string, "default" | "success" | "error" | "info"> = {
  Borrador: "default",
  Aprobado: "success",
  Rechazado: "error",
  Facturado: "info",
};

export default function QuoteRow({
  quote,
  isExpanded,
  invoicingId,
  duplicatingId,
  onExpand,
  onInvoice,
  onDuplicate,
}: QuoteRowProps) {
  return (
    <>
      <TableRow hover>
        <TableCell padding="checkbox">
          <IconButton
            size="small"
            onClick={() => onExpand(quote.id)}
            aria-label="Ver artículos del presupuesto"
          >
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>{quote.numero}</TableCell>

        <TableCell>
          {new Date(quote.fecha).toLocaleDateString("es-AR", {
            timeZone: "UTC",
          })}
        </TableCell>

        <TableCell>{quote.clienteRazonSocial}</TableCell>

        <TableCell>
          <Chip
            label={quote.estado}
            color={estadoColors[quote.estado] ?? "default"}
            size="small"
          />
        </TableCell>

        <TableCell align="right">{formatCurrency(quote.subtotal)}</TableCell>

        <TableCell align="right">{formatCurrency(quote.iva)}</TableCell>

        <TableCell align="right">
          <Typography variant="subtitle1">
            {formatCurrency(quote.total)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => onDuplicate(quote.id)}
              disabled={duplicatingId !== null || invoicingId !== null}
            >
              {duplicatingId === quote.id ? "Duplicando..." : "Duplicar"}
            </Button>

            {quote.estado !== "Facturado" && (
              <Button
                variant="contained"
                size="small"
                onClick={() => onInvoice(quote.id)}
                disabled={
                  invoicingId !== null ||
                  duplicatingId !== null ||
                  quote.estado === "Facturada"
                }
              >
                {invoicingId === quote.id ? "Facturando..." : "Facturar"}
              </Button>
            )}
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          colSpan={9}
          sx={{ py: 0, borderBottom: isExpanded ? undefined : 0 }}
        >
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <QuoteItems quote={quote} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
