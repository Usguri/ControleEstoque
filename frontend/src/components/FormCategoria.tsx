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
  TextField,
  Switch,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useCategoria } from "../hooks/useCategoria";
import type { Categoria } from "../types/categoria.types";
import DeleteIcon from "@mui/icons-material/Delete";

export const FormCategoria = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [listaCategoria, setlistaCategoria] = useState<Categoria[]>([]);
  const { BuscaCategorias, AdicionarNovaCategoria, EditarTextCategoria, EditarCheckCategoria, ExcluirCategoria } =
    useCategoria();

  useEffect(() => {
    if (open) {
      carregarCategorias();
    }
  }, [open]);

  if (!open) return null;

  async function carregarCategorias() {
    const data = await BuscaCategorias();
    setlistaCategoria(data);
  }

  function handleTextField(idCategoria: number, editcategoria: string) {
    setlistaCategoria((prevLista) =>
      prevLista.map((item) => (item.idCategoria === idCategoria ? { ...item, categoria: editcategoria } : item)),
    );
  }

  function handleChangeCheck(idCategoria: number, novoValor: boolean) {
    setlistaCategoria((prevLista) =>
      prevLista.map((item) => (item.idCategoria === idCategoria ? { ...item, check: novoValor } : item)),
    );
    EditarCheckCategoria(idCategoria, novoValor);
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
              Adicionar Categoria
            </Typography>
            <Button
              color="success"
              size="small"
              variant="contained"
              sx={{ position: "absolute", right: 0 }}
              onClick={async () => {
                await AdicionarNovaCategoria();
                carregarCategorias();
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
                maxHeight: 350,
                overflow: "auto",
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Categoria</TableCell>
                    <TableCell align="center">Ativar/Desativar</TableCell>
                    <TableCell align="center">Excluir</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listaCategoria.map((row) => (
                    <TableRow key={row.idCategoria} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          variant="standard"
                          type="text"
                          value={row.categoria}
                          onBlur={async (e) => await EditarTextCategoria(row.idCategoria, e.target.value)}
                          onChange={(e) => handleTextField(row.idCategoria, e.target.value)}
                          sx={{
                            backgroundColor: "rgba(0, 0, 0, 0.03)",
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                            },
                          }}
                          InputProps={{ disableUnderline: true }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={row.check}
                          onChange={(e) => handleChangeCheck(row.idCategoria, e.target.checked)}
                          slotProps={{ input: { "aria-label": "controlled" } }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={async () => {
                            await ExcluirCategoria(row.idCategoria);
                            carregarCategorias();
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
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

const style = {
  position: "absolute",
  top: "35%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 700, lg: 800 },
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 4,
};
