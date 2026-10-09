import {
  Button,
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AcessosSistema } from "../types/acessosSistema.types";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useAddAcessos } from "../hooks/useAddAcessos";
import { FormDadosUserCliente } from "./FormDadosUserCliente";

export const FormAddNewAcess = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [listaAcessos, setlistaAcessos] = useState<AcessosSistema[]>([]);
  const { BuscaAllUsuarios, StatusCheck, ResetarAcessoSistema, DeletarUsuario } = useAddAcessos();
  const [openNewUsuario, setopenNewUsuario] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      ListaAllUsuarios();
    }
  }, [open]);

  if (!open) return null;

  async function ListaAllUsuarios() {
    setlistaAcessos(await BuscaAllUsuarios());
  }

  function handleCheckUserAtivo(idUsuario: number, novoValor: boolean) {
    setlistaAcessos((prevLista) =>
      prevLista.map((item) => (item.idUsuario === idUsuario ? { ...item, userAtivo: novoValor } : item)),
    );
    StatusCheck(idUsuario, novoValor);
  }

  function ResetarSenhaUsuario(idUsuario: number) {
    setlistaAcessos((prevLista) =>
      prevLista.map((item) => (item.idUsuario === idUsuario ? { ...item, primeiroAcesso: false } : item)),
    );
    ResetarAcessoSistema(idUsuario);
  }

  async function DeletarUsuarioSistema(idUser: number) {
    const retorno = await DeletarUsuario(idUser);

    if (retorno) {
      setlistaAcessos((prevLista) => prevLista.filter((item) => item.idUsuario !== idUser));
    }
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
              Lista de usuários
            </Typography>
            <Button
              color="success"
              size="small"
              variant="contained"
              sx={{ position: "absolute", right: 0 }}
              onClick={() => {
                setopenNewUsuario(true);
              }}
            >
              Novo
            </Button>
          </Box>

          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 400,
                overflow: "auto",
              }}
            >
              <Table sx={{ minWidth: 780 }} aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Usuario</TableCell>
                    <TableCell align="center">E-mail</TableCell>
                    <TableCell align="center">Regra</TableCell>
                    <TableCell align="center">Ativar/Desativar</TableCell>
                    <TableCell align="center">1° Acesso</TableCell>
                    <TableCell align="center">Resetar</TableCell>
                    <TableCell align="center">Excluir</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listaAcessos.map((row) => (
                    <TableRow key={row.idUsuario} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell align="center">{row.nome}</TableCell>

                      <TableCell align="center">{row.usuario}</TableCell>

                      <TableCell align="center">{row.role == 1 ? "Admin" : "Cliente"}</TableCell>

                      <TableCell align="center">
                        <Switch
                          checked={row.userAtivo}
                          onChange={(e) => handleCheckUserAtivo(row.idUsuario, e.target.checked)}
                          slotProps={{ input: { "aria-label": "controlled" } }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          title={row.primeiroAcesso ? "Já acessou o sistema" : "Ainda não acessou o sistema"}
                          color={row.primeiroAcesso ? "success" : "warning"}
                        >
                          <HowToRegIcon />
                        </IconButton>
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          title="Resetar senha"
                          onClick={async () => {
                            ResetarSenhaUsuario(row.idUsuario);
                          }}
                        >
                          <RestartAltIcon />
                        </IconButton>
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          title="Deletar usuário"
                          onClick={async () => {
                            await DeletarUsuarioSistema(row.idUsuario);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Modal>

      <FormDadosUserCliente
        open={openNewUsuario}
        onClose={() => {
          setopenNewUsuario(false);
          ListaAllUsuarios();
        }}
      />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

const style = {
  position: "absolute",
  top: "35%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 750, lg: 1100 },
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 4,
};
