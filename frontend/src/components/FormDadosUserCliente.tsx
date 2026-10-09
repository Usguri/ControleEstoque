import { Button, Modal, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { dadosNovoUsuario, type CriarAcessoSistema } from "../types/acessosSistema.types";
import { useAddAcessos } from "../hooks/useAddAcessos";

export const FormDadosUserCliente = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [addNewUsuario, setaddNewUsuario] = useState<CriarAcessoSistema>(dadosNovoUsuario);
  const { AddNewAcesso } = useAddAcessos();

  useEffect(() => {
    if (open) {
      setaddNewUsuario(dadosNovoUsuario);
    }
  }, [open]);

  if (!open) return null;

  function handleTextNomeUsuario(nome: string) {
    setaddNewUsuario({ ...addNewUsuario, nome: nome });
  }
  function handleTextEmail(usuario: string) {
    setaddNewUsuario({ ...addNewUsuario, usuario: usuario });
  }
  function handleRole(role: number) {
    setaddNewUsuario({ ...addNewUsuario, role: role });
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
              Adicionar Novo Acesso
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
                  label="Nome"
                  fullWidth
                  value={addNewUsuario.nome}
                  onChange={(e) => handleTextNomeUsuario(e.target.value)}
                />
                <TextField
                  size="small"
                  variant="outlined"
                  label="E-mail"
                  fullWidth
                  value={addNewUsuario.usuario}
                  onChange={(e) => handleTextEmail(e.target.value)}
                />

                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small-label">Role</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-simple-select"
                    value={addNewUsuario.role}
                    label="Role"
                    onChange={(e) => handleRole(e.target.value)}
                  >
                    <MenuItem value={1}>Admin</MenuItem>
                    <MenuItem value={2}>Cliente</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ marginTop: "16px" }}>
              <Button
                variant="contained"
                color="success"
                sx={{ display: "flex", margin: "0 auto" }}
                onClick={async () => {
                  await AddNewAcesso(addNewUsuario);
                  onClose();
                }}
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
