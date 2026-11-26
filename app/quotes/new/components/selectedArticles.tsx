import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";

import { QuoteItem } from "../../../types/quote";
import { formatCurrency } from "../../utils/formatCurrency";

interface SelectedArticlesProps {
  selectedArticles: QuoteItem[];
  onUpdate: (
    articleId: number,
    field: "cantidad" | "descuentoPct",
    value: number,
  ) => void;
  onRemove: (articleId: number) => void;
}

export function SelectedArticles({
  selectedArticles,
  onUpdate,
  onRemove,
}: SelectedArticlesProps) {
  if (selectedArticles.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        Todavía no agregaste artículos.
      </Typography>
    );
  }

  return (
    <List>
      {selectedArticles.map((item) => (
        <ListItem key={item.articuloId} divider>
          <ListItemText
            primary={`${item.articuloCodigo} - ${item.articuloDescripcion}`}
            secondary={`Precio unitario: ${formatCurrency(item.precioUnitario)} | IVA: ${item.alicuotaIva}%`}
          />

          <TextField
            label="Cantidad"
            type="number"
            size="small"
            value={item.cantidad}
            onChange={(event) =>
              onUpdate(item.articuloId, "cantidad", Number(event.target.value))
            }
            sx={{ width: 100, mr: 2 }}
            slotProps={{ htmlInput: { min: 1 } }}
          />

          <TextField
            label="Descuento %"
            type="number"
            size="small"
            value={item.descuentoPct}
            onChange={(event) =>
              onUpdate(
                item.articuloId,
                "descuentoPct",
                Number(event.target.value),
              )
            }
            sx={{ width: 120, mr: 1 }}
            slotProps={{ htmlInput: { min: 0, max: 100 } }}
          />

          <IconButton
            color="error"
            onClick={() => onRemove(item.articuloId)}
            aria-label="Eliminar artículo"
          >
            ×
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}
