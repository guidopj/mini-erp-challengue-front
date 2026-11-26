import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";

import { Quote } from "../../types/quote";
import QuoteRow from "./quoteRow";

interface QuoteTableProps {
  quotes: Quote[];
  invoicingId: number | null;
  duplicatingId: number | null;
  expandedId: number | null;
  onExpand: (id: number) => void;
  onInvoice: (id: number) => void;
  onDuplicate: (id: number) => void;
}

export default function QuoteTable({
  quotes,
  invoicingId,
  duplicatingId,
  expandedId,
  onExpand,
  onInvoice,
  onDuplicate,
}: QuoteTableProps) {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Número</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell align="right">IVA</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {quotes.map((quote) => (
            <QuoteRow
              key={quote.id}
              quote={quote}
              isExpanded={expandedId === quote.id}
              invoicingId={invoicingId}
              duplicatingId={duplicatingId}
              onExpand={onExpand}
              onInvoice={onInvoice}
              onDuplicate={onDuplicate}
            />
          ))}

          {quotes.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No hay presupuestos registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
