import { Button, Modal, Box, Typography, TextField, TextareaAutosize } from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { EMPRESA_PADRAO, type DadosEmpresa } from "../types/empresa.types";
import { formatarTelefone } from "../utils/formatadores";
import { useDadosEmpresa } from "../hooks/useDadosEmpresa";

export const FormEmpresa = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [dadosEmpresa, setdadosEmpresa] = useState<DadosEmpresa>(EMPRESA_PADRAO);
  const { BuscaDadosDaEmpresa, SalvarDadosEmpresa } = useDadosEmpresa();

  useEffect(() => {
    if (open) {
      carregarDados();
    }
  }, [open]);

  if (!open) return null;

  async function carregarDados() {
    const data = await BuscaDadosDaEmpresa();

    if (data) {
      setdadosEmpresa({
        ...data[0],
        fone: formatarTelefone(data[0].fone || ""),
      });
    }
  }

  function handleTextEmpresa(nome: string) {
    setdadosEmpresa({ ...dadosEmpresa, nomeEmpresa: nome });
  }
  function handleTextEmail(email: string) {
    setdadosEmpresa({ ...dadosEmpresa, email: email });
  }
  function handleTextFone(fone: string) {
    setdadosEmpresa({ ...dadosEmpresa, fone: fone });
  }
  function handleTextCidade(cidade: string) {
    setdadosEmpresa({ ...dadosEmpresa, cidade: cidade });
  }
  function handleTextEndereco(endereco: string) {
    setdadosEmpresa({ ...dadosEmpresa, endereco: endereco });
  }

  function handleTextAreaDescricao(descricao: string) {
    setdadosEmpresa({ ...dadosEmpresa, descricao: descricao });
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Informações da empresa
            </Typography>
          </Box>

          <Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              <Box style={{ display: "flex", gap: "16px" }}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Empresa"
                  fullWidth
                  value={dadosEmpresa.nomeEmpresa}
                  onChange={(e) => handleTextEmpresa(e.target.value)}
                />
                <TextField
                  size="small"
                  variant="outlined"
                  label="E-mail"
                  fullWidth
                  value={dadosEmpresa.email}
                  onChange={(e) => handleTextEmail(e.target.value)}
                />
              </Box>

              <Box style={{ display: "flex", gap: "16px" }}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="(xx) xxxxxxxxx"
                  fullWidth
                  value={dadosEmpresa.fone}
                  onChange={(e) => {
                    const formatado = formatarTelefone(e.target.value);
                    handleTextFone(formatado);
                  }}
                />
                <TextField
                  size="small"
                  variant="outlined"
                  label="Cruz Alta"
                  fullWidth
                  value={dadosEmpresa.cidade}
                  onChange={(e) => handleTextCidade(e.target.value)}
                />
              </Box>

              <TextField
                size="small"
                variant="outlined"
                label="Endereço"
                fullWidth
                value={dadosEmpresa.endereco}
                onChange={(e) => handleTextEndereco(e.target.value)}
              />

              <TextareaAutosize
                aria-label="minimum height"
                placeholder="Descrição"
                value={dadosEmpresa.descricao}
                onChange={(e) => handleTextAreaDescricao(e.target.value)}
                style={{ height: 60, resize: "none" }}
              />
            </Box>

            <Box sx={{ marginTop: "16px" }}>
              <Button
                variant="contained"
                color="success"
                sx={{ display: "flex", margin: "0 auto" }}
                onClick={async () => await SalvarDadosEmpresa(dadosEmpresa)}
              >
                Salvar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

const style = {
  position: "absolute",
  top: "35%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "85%", md: 800, lg: 1000 },
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 4,
};
