import {
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
  IconButton,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useListaCompras } from "../hooks/useListaCompras";
import type { DadosListaPedido } from "../types/infoEmpresaComer.types";
import { formatarDataBr } from "../utils/formatadores";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { gerarPDF } from "../utils/GerarPDF";
import { mesesDoAno, VerificaMesAtual } from "../utils/validacoes";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export const ListaPedidosCompra = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { HistoricoPedidosCompra, ListaProdutosComprados, CancelarPedido } = useListaCompras();
  const [listaPedidos, setlistaPedidos] = useState<DadosListaPedido[]>([]);
  const [meses, setmeses] = useState<string>("");
  const [armTemp, setarmTemp] = useState<DadosListaPedido[]>([]);
  const [busca, setBusca] = useState<string>("");

  useEffect(() => {
    if (open) {
      const mes = VerificaMesAtual();
      carregarListaPedidos(mes);
      setmeses(mes);
    }
  }, [open]);

  async function carregarListaPedidos(mes: string) {
    const dados = await HistoricoPedidosCompra(mes);
    setarmTemp(dados);
    setlistaPedidos(dados);
  }

  async function allPedidos(pedido: DadosListaPedido) {
    const lista = await ListaProdutosComprados(pedido.idlista);
    gerarPDF(pedido, lista.dadosCompra);
  }

  function handleAlterarMes(mes: string) {
    carregarListaPedidos(mes);
    setmeses(mes);
  }

  async function cancelarPedido(idlista: number) {
    await CancelarPedido(idlista);
    carregarListaPedidos(meses);
  }

  if (!open) return null;

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                Lista de pedidos de compras
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Select value={meses} onChange={(e) => handleAlterarMes(e.target.value)} size="small" displayEmpty>
                {mesesDoAno.map((mes) => (
                  <MenuItem key={mes.numero} value={mes.numero}>
                    {mes.nome}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                label="Procure"
                variant="outlined"
                size="small"
                value={busca}
                onChange={(e) => {
                  const valor = e.target.value;
                  setBusca(valor);

                  const filtrados = armTemp.filter(
                    (item) =>
                      item.email?.toLowerCase().includes(valor.toLowerCase()) ||
                      item.empresa?.toLowerCase().includes(valor.toLowerCase()) ||
                      item.datahora?.toLowerCase().includes(valor.toLowerCase()),
                  );

                  setlistaPedidos(filtrados);
                }}
              />
            </Box>
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
                maxHeight: 350,
                overflow: "auto",
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Empresa</TableCell>
                    <TableCell align="center">E-mail</TableCell>
                    <TableCell align="center">Telefone</TableCell>
                    <TableCell align="center">Data/Hora</TableCell>
                    <TableCell align="center">Pedido</TableCell>
                    <TableCell align="center">Status Pedido</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listaPedidos.map((row, idx) => (
                    <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell align="center">{row.empresa}</TableCell>
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">{row.fone}</TableCell>
                      <TableCell align="center">{formatarDataBr(row.datahora)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => {
                            allPedidos(row);
                          }}
                        >
                          <PictureAsPdfIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        {!row.compfinalizada ? (
                          <IconButton
                            title="Cancelar Pedido"
                            onClick={() => {
                              cancelarPedido(row.idlista);
                            }}
                          >
                            <CheckCircleIcon color="success" />
                          </IconButton>
                        ) : (
                          <CancelIcon color="error" titleAccess="Pedido Cancelado" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
  width: { xs: "90%", sm: "80%", md: "70%", lg: 1200, xl: 1400 },
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 4,
};
