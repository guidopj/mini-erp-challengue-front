
"use client";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  SvgIcon,
  Typography,
} from "@mui/material";

import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

import { useRouter } from "next/navigation";

const modules = [
  {
    title: "Presupuestos",
    description: "Consultar y administrar presupuestos.",
    action: "Ver presupuestos",
    path: "/quotes",
    icon: (
      <SvgIcon fontSize="large">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8zm0 2.5L17.5 8H14zM18 20H6V4h6v6h6zM8 12h8v2H8zm0 4h8v2H8z" />
      </SvgIcon>
    ),
  },
  {
    title: "Artículos",
    description: "Consultar el catálogo de artículos.",
    action: "Ver artículos",
    path: "/articles",
    icon: <InventoryOutlinedIcon fontSize="large" />,
  },
  {
    title: "Clientes",
    description: "Consultar los clientes registrados.",
    action: "Ver clientes",
    path: "/customers",
    icon: (
      <SvgIcon fontSize="large">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 .17c-.29 0-.62.02-.97.05 1.16.84 1.97 1.94 1.97 3.28V19h7v-2.5c0-2.33-4.67-3.5-8-3.5z" />
      </SvgIcon>
    ),
  },
  {
    title: "Facturas",
    description: "Consultar las facturas emitidas.",
    action: "Ver facturas",
    path: "/invoices",
    icon: <ReceiptLongOutlinedIcon fontSize="large" />,
  },
  {
    title: "Dashboard",
    description: "Consultar indicadores y actividad.",
    action: "Ver resumen",
    path: "/dashboard",
    icon: <BarChartOutlinedIcon fontSize="large" />,
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          MiniErp
        </Typography>

        <Typography color="text.secondary">
          Bienvenido. Seleccioná un módulo para comenzar.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid key={module.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#111b2e",
                border: "1px solid #263449",
                borderRadius: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#38bdf8",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardActionArea
                onClick={() => router.push(module.path)}
                sx={{ height: "100%" }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: "#38bdf8", mb: 2 }}>
                    {module.icon}
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
                    {module.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 3, color: "#fff" }}
                  >
                    {module.description}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "#fff" }}
                  >
                    {module.action} →
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
