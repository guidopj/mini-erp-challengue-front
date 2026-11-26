import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { Quote } from "../../types/quote";
import { formatCurrency } from "../utils/formatCurrency";

interface QuoteItemsProps {
  quote: Quote;
}

export default function QuoteItems({ quote }: QuoteItemsProps) {
  return (
    <Box sx={{ margin: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Artículos del presupuesto
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell align="right">Precio unitario</TableCell>
            <TableCell align="right">Descuento</TableCell>
            <TableCell align="right">IVA</TableCell>
            <TableCell align="right">Subtotal</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {quote.items.map((item, index) => (
            <TableRow key={`${item.articuloId}-${index}`}>
              <TableCell>{item.articuloCodigo}</TableCell>
              <TableCell>{item.articuloDescripcion}</TableCell>
              <TableCell align="right">{item.cantidad}</TableCell>
              <TableCell align="right">
                {formatCurrency(item.precioUnitario)}
              </TableCell>
              <TableCell align="right">{item.descuentoPct}%</TableCell>
              <TableCell align="right">{item.alicuotaIva}%</TableCell>
              <TableCell align="right">
                {formatCurrency(item.subtotalLinea)}
              </TableCell>
            </TableRow>
          ))}

          {quote.items.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Este presupuesto no tiene artículos.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
