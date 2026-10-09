import { Button, Modal, Box, Typography, TextField, FormHelperText, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { CriarSenha, type NovaSenha } from "../types/acessosSistema.types";
import { useAddAcessos } from "../hooks/useAddAcessos";

export const AlterarSenhaUsuario = ({
  open,
  onClose,
  idUsuario,
}: {
  open: boolean;
  onClose: (sucesso?: boolean) => void;
  idUsuario: number;
}) => {
  const [alterarSenha, setalterarSenha] = useState<NovaSenha>(CriarSenha);
  const { AlterarSenhaAcessoUsuario } = useAddAcessos();

  useEffect(() => {
    if (open) {
      setalterarSenha({ ...CriarSenha, idUsuario: Number(idUsuario) });
    }
  }, [open]);

  if (!open) return null;

  function handleTextSenhaAtual(senhaAtl: string) {
    setalterarSenha({ ...alterarSenha, senhaAtual: senhaAtl });
  }
  function handleTextNovaSenha(senhaNv: string) {
    setalterarSenha({ ...alterarSenha, novaSenha: senhaNv });
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={() => onClose(false)}
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
              Crie sua nova senha
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
              <Box display="flex" gap={2}>
                <FormControl fullWidth>
                  <TextField
                    size="small"
                    label="Senha Atual"
                    type="password"
                    value={alterarSenha.senhaAtual}
                    onChange={(e) => handleTextSenhaAtual(e.target.value)}
                  />
                  <FormHelperText>
                    • Pelo menos uma letra maiúscula
                    <br />
                    • Pelo menos uma letra minúscula
                    <br />
                    • Pelo menos um caractere especial
                    <br />• Pelo menos um número
                  </FormHelperText>
                  <FormHelperText error>Crie uma senha forte</FormHelperText>
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    size="small"
                    label="Nova Senha"
                    type="password"
                    value={alterarSenha.novaSenha}
                    onChange={(e) => handleTextNovaSenha(e.target.value)}
                  />
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ marginTop: "16px" }}>
              <Button
                variant="contained"
                color="success"
                sx={{ display: "flex", margin: "0 auto" }}
                onClick={async () => {
                  const dataRetorno = await AlterarSenhaAcessoUsuario(alterarSenha);
                  if (dataRetorno) {
                    onClose(true);
                  }
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
