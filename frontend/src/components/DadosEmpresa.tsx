import { Box, Container, Grid, Typography } from "@mui/material";
import { useDadosEmpresa } from "../hooks/useDadosEmpresa";
import { useEffect, useState } from "react";
import { EMPRESA_PADRAO, type DadosEmpresa } from "../types/empresa.types";
import logoRodape from "../image/logoRodape.png";
import { Link } from "@mui/material";

export default function DadosEmpresa({
  numeroWhatsapp,
}: {
  numeroWhatsapp: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { BuscaDadosDaEmpresa } = useDadosEmpresa();
  const [dadosEmpresa, setdadosEmpresa] = useState<DadosEmpresa>(EMPRESA_PADRAO);

  useEffect(() => {
    const load = async () => {
      const dados = await BuscaDadosDaEmpresa();
      setdadosEmpresa(dados[0]);
      numeroWhatsapp(dados[0].fone.replace(/\D/g, ""));
    };
    load();
  }, []);

  return (
    <Box
      sx={{
        color: "#1a1a1a",
        py: 2,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              <Box
                component="img"
                src={logoRodape}
                sx={{
                  width: { xs: 160, sm: 160, md: 160 },
                  height: "auto",
                }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "rgba(0, 0, 0, .9)", fontSize: 14, fontFamily: "Quicksand" }}
            >
              Contato
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(0, 0, 0, .55)", fontSize: 13, fontFamily: "Quicksand" }}>
              Rua {dadosEmpresa.endereco}
              <br />
              {dadosEmpresa.cidade} - RS
              <br />
              Tel: {dadosEmpresa.fone}
              <br />
              Email: {dadosEmpresa.email}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
          <Typography sx={{ color: "rgba(0, 0, 0, .55)", fontSize: 11 }}>
            <Link
              href="https://www.linkedin.com/in/vin%C3%ADcius-mendes-padilha-431507189/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              Copyright © 2026 Vinícius Mendes
            </Link>
            .
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
