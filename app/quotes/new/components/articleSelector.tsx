import { Autocomplete, Button, TextField } from "@mui/material";

import { Article } from "../../../types/article";

interface ArticleSelectorProps {
  articles: Article[];
  selectedArticle: Article | null;
  onSelect: (article: Article | null) => void;
  onAdd: () => void;
}

export function ArticleSelector({
  articles,
  selectedArticle,
  onSelect,
  onAdd,
}: ArticleSelectorProps) {
  return (
    <>
      <Autocomplete
        options={articles}
        value={selectedArticle}
        onChange={(_, value) => onSelect(value)}
        getOptionLabel={(article) =>
          `${article.codigo} - ${article.descripcion}`
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar artículo"
            placeholder="Ingresá código o descripción"
          />
        )}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={onAdd}
        disabled={!selectedArticle}
      >
        Agregar artículo
      </Button>
    </>
  );
}
