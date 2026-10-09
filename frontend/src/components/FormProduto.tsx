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
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { FormAddProduto } from "./FormAddProduto";
import { useAddProdutos } from "../hooks/useAddProduto";
import { type ProdutoListagem } from "../types/produtos.type";

export const FormProduto = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [openModalAddproduto, setopenModalAddproduto] = useState<boolean>(false);
  const { ListaAllProdutos, AlterarStatusProduto, AlterarStatusPromocaoProduto, DeletarProduto } = useAddProdutos();
  const [listaProdutos, setlistaProdutos] = useState<ProdutoListagem[]>([]);
  const [editarProduto, seteditarProduto] = useState<number>();
  const [armTemp, setarmTemp] = useState<ProdutoListagem[]>([]);
  const [busca, setBusca] = useState<string>("");

  useEffect(() => {
    if (open) {
      carregarProdutos();
    }
  }, [open]);

  async function carregarProdutos() {
    const dados = await ListaAllProdutos();
    setlistaProdutos(dados);
    setarmTemp(dados);
  }

  function handleChangeCheckStatus(idproduto: number, check: boolean) {
    setlistaProdutos((prevLista) =>
      prevLista.map((item) => (item.idProduto === idproduto ? { ...item, statusProduto: check } : item)),
    );
    AlterarStatusProduto(idproduto, check);
  }

  function handleChangeCheckPromocao(idproduto: number, check: boolean) {
    setlistaProdutos((prevLista) =>
      prevLista.map((item) => (item.idProduto === idproduto ? { ...item, promocao: check } : item)),
    );
    AlterarStatusPromocaoProduto(idproduto, check);
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Lista de Produtos
            </Typography>

            <Box sx={{ display: "flex", gap: 1, position: "absolute", right: 0 }}>
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
                      item.codProduto?.toLowerCase().includes(valor.toLowerCase()) ||
                      item.nomeProduto?.toLowerCase().includes(valor.toLowerCase()),
                  );

                  setlistaProdutos(filtrados);
                }}
              />
              <Button
                color="success"
                size="small"
                variant="contained"
                onClick={() => {
                  setopenModalAddproduto(true);
                  seteditarProduto(undefined);
                }}
              >
                Novo
              </Button>
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
                    <TableCell align="center">Cod. Produto</TableCell>
                    <TableCell align="center">Produto</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Preço</TableCell>
                    <TableCell align="center">Promoção</TableCell>
                    <TableCell align="center">Quant.Atual</TableCell>
                    <TableCell align="center">Quant.Vendida</TableCell>
                    <TableCell align="center">Opções</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listaProdutos.map((row, idx) => (
                    <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell align="center">{row.codProduto}</TableCell>
                      <TableCell align="center">{row.nomeProduto}</TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={row.statusProduto}
                          onChange={(e) => handleChangeCheckStatus(row.idProduto, e.target.checked)}
                          slotProps={{ input: { "aria-label": "controlled" } }}
                        />
                      </TableCell>
                      <TableCell align="center">R$ {row.preco}</TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={row.promocao}
                          onChange={(e) => handleChangeCheckPromocao(row.idProduto, e.target.checked)}
                          slotProps={{ input: { "aria-label": "controlled" } }}
                        />
                      </TableCell>
                      <TableCell align="center">{row.quantidadeAtual}</TableCell>
                      <TableCell align="center">{row.quantidadeVendida}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => {
                            setopenModalAddproduto(true);
                            seteditarProduto(row.idProduto);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={async () => {
                            await DeletarProduto(row.idProduto);
                            carregarProdutos();
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
      <FormAddProduto
        open={openModalAddproduto}
        onClose={() => {
          setopenModalAddproduto(false);
          carregarProdutos();
        }}
        idProduto={editarProduto}
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
  width: { xs: "90%", sm: "80%", md: "70%", lg: 1200, xl: 1400 },
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 4,
};
