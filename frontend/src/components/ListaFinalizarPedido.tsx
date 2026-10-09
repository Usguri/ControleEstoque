import { useEffect, useState } from "react";
import type { listaProdComer } from "../types/listaProdComer.types";
import { Box, Button, Card, CardContent, CardMedia, Grid, IconButton, Modal, Typography } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useListaCompras } from "../hooks/useListaCompras";
import type { listaProdFinalizarCompra } from "../types/listaProdComer.types";
import { formatarMoney } from "../utils/formatadores";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../hooks/useAuth";

export function ListaFinalizarPedido({
  open,
  onClose,
  onRemoverItemFilho,
  listaCompra,
  onFinalizarCompra,
}: {
  open: boolean;
  onClose: () => void;
  onRemoverItemFilho: (idprod: number) => void;
  listaCompra: listaProdComer[];
  onFinalizarCompra?: (sucesso: boolean) => void;
}) {
  const { BuscaProdComercializar, FinalizarCompraCliente } = useListaCompras();
  const [listProdFinalComp, setlistProdFinalComp] = useState<listaProdFinalizarCompra[]>([]);
  const [somaTotalPedFinal, setsomaTotalPedFinal] = useState<number>(0);
  const [loading, setloading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      const load = async () => {
        if (listaCompra.length > 0) {
          const ids = listaCompra.map((item) => item.idProduto);
          const listaProdComer = await BuscaProdComercializar(ids);

          const listaProdComQuantidade = listaProdComer.map((prod: { idProduto: number }) => {
            const itemCompra = listaCompra.find((item) => item.idProduto === prod.idProduto);
            return {
              ...prod,
              quantidade: itemCompra?.quant || 0,
            };
          });

          setlistProdFinalComp(listaProdComQuantidade);
        } else {
          onClose();
          toast.error("Favor selecione alguns produtos!");
        }

        SomaValorPedido();
        setloading(false);
      };
      load();
    }
  }, [open]);

  function ExcluirItemCarrinho(idprod: number) {
    setlistProdFinalComp((prev) => {
      const newList = prev.filter((e) => e.idProduto != idprod);

      if (newList.length === 0) {
        onClose();
      }

      return newList;
    });
    SomaValorPedido(idprod);
  }

  function SomaValorPedido(idprod?: number) {
    setsomaTotalPedFinal(() => {
      const lista = idprod ? listaCompra.filter((e) => e.idProduto !== idprod) : listaCompra;
      return lista.reduce((acc, item) => acc + item.quant * item.value, 0);
    });
    if (idprod) {
      onRemoverItemFilho(idprod);
    }
  }

  async function FinalizarCompDadosCliente() {
    if (user?.idUsuario) {
      setloading(true);
      const retornoFinComp = await FinalizarCompraCliente(listProdFinalComp, user?.idUsuario);

      if (retornoFinComp.cod == 200) {
        toast.success(retornoFinComp.message);
      } else if (retornoFinComp.cod == 201) {
        toast.error(retornoFinComp.message);
      } else if (retornoFinComp.cod == 202) {
        toast.error(retornoFinComp.message);
      }

      setTimeout(() => {
        if (retornoFinComp.cod == 200) {
          onClose();
          onFinalizarCompra?.(true);
        } else {
          setloading(false);
        }
      }, 1000);
    }
  }

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
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
              Finalizar compra
            </Typography>
          </Box>
          <Box
            sx={{
              maxHeight: "600px",
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#555",
                },
              },
            }}
          >
            {listProdFinalComp.map((product) => {
              const getImageUrl = (caminho: string) => {
                return `${import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://api.vmsystems.cloud"}/${caminho}`;
              };

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={product.idProduto} sx={{ mb: 1 }}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        gap: 2,
                      }}
                    >
                      {product.imagemProduto && (
                        <CardMedia
                          component="img"
                          sx={{
                            width: 120,
                            height: 120,
                            objectFit: "contain",
                          }}
                          image={getImageUrl(product.imagemProduto)}
                        />
                      )}

                      <CardContent sx={{ flex: 1, p: 0 }}>
                        <Typography variant="body1" sx={{ mb: 0.5, fontFamily: "Quicksand" }}>
                          Produto: {product.nomeProduto} - {product.codProduto}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 0.5, fontFamily: "Quicksand" }}>
                          Quantidade: {product.quantidade}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 0.5, fontFamily: "Quicksand" }}>
                          Preço: R$ {product.preco}
                        </Typography>

                        <Typography variant="body2" sx={{ fontWeight: "bold", fontFamily: "Quicksand" }}>
                          Total: R$ {formatarMoney((product.quantidade * product.preco).toString())}
                        </Typography>
                      </CardContent>

                      <IconButton onClick={() => ExcluirItemCarrinho(product.idProduto)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Box>
          <Box sx={{ fontFamily: "Quicksand", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography>
              Valor do Pedido:
              <Typography component="span" sx={{ fontWeight: "bold", ml: 0.5 }}>
                R$ {formatarMoney(somaTotalPedFinal.toFixed(2))}
              </Typography>
            </Typography>

            <Button
              variant="contained"
              sx={{
                bgcolor: "#f3e3ec",
                color: "#800080",
                fontFamily: "Quicksand",
              }}
              onClick={() => FinalizarCompDadosCliente()}
            >
              Finalizar Compra
            </Button>
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
    </div>
  );
}

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100%", sm: "100%", md: "100%", lg: "80%", xl: "80%" },
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 4,
};
