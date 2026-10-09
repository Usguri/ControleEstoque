import { Button, Modal, Box, Typography, TextField, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { formatarTelefone } from "../utils/formatadores";
import { dadosClienteVazio, type DadosCliente } from "../types/infoEmpresaComer.types";
import { formatarCNPJCPF } from "../utils/formatadores";
import { buscarEmpresaPorCNPJ } from "../utils/buscaDadosCliente";
import { ValidaDadosEmpresa } from "../utils/validacoes";
import { useAuth } from "../hooks/useAuth";
import { useClientes } from "../hooks/useClientes";

export const FormCliente = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [datacliente, setdatacliente] = useState<DadosCliente>(dadosClienteVazio);
  const [mostrarCampos, setMostrarCampos] = useState(false);
  const [buscaCNPJVez, setbuscaCNPJVez] = useState(false);
  const [loading, setloading] = useState<boolean>(false);
  const { SalvarDadosCliente, BuscarDadosCliente, EditarDadosCliente } = useClientes();
  const { user } = useAuth();
  const [disabledTextField, setdisabledTextField] = useState<boolean>(false);
  const [nameButton, setnameButton] = useState<string>("Cadastro dados cliente");

  useEffect(() => {
    if (open) {
      const load = async () => {
        if (user?.idUsuario) {
          const cliente = await BuscarDadosCliente(user.idUsuario);

          if (cliente?.cnpj) {
            setdatacliente(cliente);
            setMostrarCampos(true);
            setdisabledTextField(true);
            setnameButton("Editar dados cliente");
          } else {
            setdatacliente({ ...dadosClienteVazio, idUsuario: user.idUsuario });
            setMostrarCampos(false);
          }
        } else {
          setdatacliente(dadosClienteVazio);
          setMostrarCampos(false);
          setbuscaCNPJVez(false);
          setloading(false);
        }
      };

      load();
    }
  }, [open]);

  if (!open) return null;

  function handleTextCnpj(value: string) {
    if (value != "") {
      const valorFormatado = formatarCNPJCPF(value);
      setdatacliente({ ...datacliente, cnpj: valorFormatado });
    }
  }
  function handleTextEmail(email: string) {
    setdatacliente({ ...datacliente, email: email });
  }
  function handleTextFone(fone: string) {
    setdatacliente({ ...datacliente, telefone: fone });
  }
  function handleTextCidade(cidade: string) {
    setdatacliente({ ...datacliente, cidade: cidade });
  }
  function handleTextIe(endereco: string) {
    setdatacliente({ ...datacliente, ie: endereco });
  }
  function handleTextEmpresa(descricao: string) {
    setdatacliente({ ...datacliente, empresa: descricao });
  }

  const handleBlurCnpj = async () => {
    if (!buscaCNPJVez) {
      if (datacliente.cnpj) {
        setloading(true);

        const timeoutId = setTimeout(() => {
          setloading(false);
          setMostrarCampos(true);
        }, 5000);

        try {
          const dados = await buscarEmpresaPorCNPJ(datacliente.cnpj);

          clearTimeout(timeoutId);
          setloading(false);

          setdatacliente({
            ...datacliente,
            empresa: dados.razao_social || dados.nome_fantasia || dados.nome,
            email: dados.email || "",
            ie: "",
            cidade: dados.municipio + "-" + dados.uf,
            telefone: dados.telefone,
          });

          setMostrarCampos(true);
          setbuscaCNPJVez(true);
        } catch (error) {
          clearTimeout(timeoutId);
          setloading(false);
          setMostrarCampos(true);
        }
      }
    }
  };

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
              {nameButton}
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
                {mostrarCampos && (
                  <TextField
                    size="small"
                    variant="outlined"
                    label="Empresa"
                    fullWidth
                    value={datacliente?.empresa}
                    onChange={(e) => handleTextEmpresa(e.target.value)}
                  />
                )}
                <TextField
                  size="small"
                  variant="outlined"
                  label="CNPJ"
                  fullWidth
                  value={datacliente.cnpj}
                  onChange={(e) => handleTextCnpj(e.target.value)}
                  onBlur={handleBlurCnpj}
                  inputProps={{
                    maxLength: 18,
                  }}
                />
              </Box>

              {mostrarCampos && (
                <>
                  <Box style={{ display: "flex", gap: "16px" }}>
                    <TextField
                      size="small"
                      variant="outlined"
                      label="Cidade"
                      fullWidth
                      value={datacliente?.cidade}
                      onChange={(e) => handleTextCidade(e.target.value)}
                    />
                    <TextField
                      size="small"
                      variant="outlined"
                      label="Email"
                      fullWidth
                      value={datacliente?.email}
                      onChange={(e) => handleTextEmail(e.target.value)}
                    />
                  </Box>

                  <Box style={{ display: "flex", gap: "16px" }}>
                    <TextField
                      size="small"
                      variant="outlined"
                      label="IE"
                      fullWidth
                      value={datacliente?.ie}
                      onChange={(e) => handleTextIe(e.target.value)}
                      inputProps={{
                        maxLength: 10,
                      }}
                    />
                    <TextField
                      size="small"
                      variant="outlined"
                      label="Telefone"
                      fullWidth
                      value={datacliente?.telefone}
                      onChange={(e) => {
                        const formatado = formatarTelefone(e.target.value);
                        handleTextFone(formatado);
                      }}
                    />
                  </Box>
                </>
              )}
            </Box>

            <Box sx={{ marginTop: "16px" }}>
              <Button
                variant="contained"
                color="success"
                sx={{
                  display: "flex",
                  margin: "0 auto",
                  bgcolor: "#f3e3ec",
                  color: "#800080",
                  fontFamily: "Quicksand",
                }}
                onClick={() => {
                  const validaCampos = ValidaDadosEmpresa(datacliente);

                  if (!validaCampos) {
                    toast.error("Existem campos que não podem ficarem vazios ao finalizar compra!");
                    return;
                  }

                  if (disabledTextField) {
                    EditarDadosCliente(datacliente);
                  } else {
                    SalvarDadosCliente(datacliente);
                  }

                  onClose();
                }}
              >
                Salvar
              </Button>
            </Box>
          </Box>

          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "rgba(255, 255, 255, 0.8)",
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
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
