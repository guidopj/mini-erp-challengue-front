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
  facturandoId: number | null;
  duplicandoId: number | null;
  expandedId: number | null;
  onExpandir: (id: number) => void;
  onFacturar: (id: number) => void;
  onDuplicar: (id: number) => void;
}

export default function QuoteTable({
  quotes,
  facturandoId,
  duplicandoId,
  expandedId,
  onExpandir,
  onFacturar,
  onDuplicar,
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
              facturandoId={facturandoId}
              duplicandoId={duplicandoId}
              onExpandir={onExpandir}
              onFacturar={onFacturar}
              onDuplicar={onDuplicar}
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
