import { AppBar, Toolbar, IconButton, Typography, Container, TextField, Button, Box } from "@mui/material";
import { Search, WhatsApp } from "@mui/icons-material";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import TableListaProdComercial from "../components/TableListaProdutosComerc";
import DadosEmpresa from "../components/DadosEmpresa";
import { useEffect, useState } from "react";
import type { listaProdComer } from "../types/listaProdComer.types";
import capaCliente from "../image/capa_cliente.png";
import toast, { Toaster } from "react-hot-toast";
import { ListaFinalizarPedido } from "../components/ListaFinalizarPedido";
import { formatarMoney } from "../utils/formatadores";
import LogoutIcon from "@mui/icons-material/Logout";
import { ModalSair } from "../components/BotaoSair";
import ListIcon from "@mui/icons-material/List";
import { ListaPedidosCompraCliente } from "../components/ListaPedidosCompraCliente";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { FormCliente } from "../components/FormCliente";

function TelaPrincipalCliente() {
  const [armDados, setarmDados] = useState<listaProdComer[]>([]);
  const [somaTotalComp, setsomaTotalComp] = useState<number>(0);
  const [numeroZap, setnumeroZap] = useState<string>("");
  const [openFinalizarPedido, setopenFinalizarPedido] = useState<boolean>(false);
  const [excItemList, setexcItemList] = useState<number>();
  const [recarregarTabela, setRecarregarTabela] = useState(0);
  const [pesquisaProduto, setpesquisaProduto] = useState<string>("");
  const [modalSairOpen, setmodalSairOpen] = useState<boolean>(false);
  const [modalAcessListaPedidos, setmodalAcessListaPedidos] = useState<boolean>(false);
  const [modalOpenPerfilCliente, setmodalOpenPerfilCliente] = useState<boolean>(false);

  useEffect(() => {
    setsomaTotalComp(armDados.reduce((acc, item) => acc + item.quant * item.value, 0));
  }, [armDados]);

  function handleRemoverItem(idprod: number) {
    setexcItemList(idprod);
  }

  function handleTextBuscaProdutos(produto: string) {
    setpesquisaProduto(produto);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ bgcolor: "#f3e3ec", boxShadow: 2, top: 0, zIndex: 1100 }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            maxWidth: 1400,
            mx: "auto",
            width: "100%",
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              letterSpacing: 0.5,
              fontFamily: "Delius Swash Caps",
            }}
          >
            <img src={capaCliente} style={{ width: 200 }} />
          </Typography>

          <TextField
            placeholder="Buscar produtos..."
            size="small"
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              minWidth: { xs: "100%", md: 300 },
              maxWidth: { xs: "100%", md: 500 },
              order: { xs: 3, md: 0 },
              bgcolor: "white",
              color: "#977fbb",
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton size="small">
                  <Search sx={{ color: "#977fbb" }} />
                </IconButton>
              ),
            }}
            value={pesquisaProduto}
            onChange={(e) => handleTextBuscaProdutos(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <IconButton
              title="Conversar no WhatsApp"
              color="inherit"
              sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              onClick={() => {
                if (numeroZap != "") {
                  window.open("https://wa.me/55" + numeroZap + "?text=Olá! Gostaria de fazer um pedido", "_blank");
                } else {
                  toast.error("Favor informar um número");
                }
              }}
            >
              <WhatsApp sx={{ color: "#977fbb" }} />
            </IconButton>

            <IconButton
              title="Meu carrinho"
              color="inherit"
              sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              onClick={() => setopenFinalizarPedido(true)}
            >
              <LocalGroceryStoreIcon sx={{ color: "#977fbb" }} />
            </IconButton>

            <IconButton
              title="Meus pedidos"
              color="inherit"
              sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              onClick={() => setmodalAcessListaPedidos(true)}
            >
              <ListIcon sx={{ color: "#977fbb" }} />
            </IconButton>

            <IconButton
              title="Perfil Cliente"
              color="inherit"
              sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              onClick={() => setmodalOpenPerfilCliente(true)}
            >
              <AssignmentIndIcon sx={{ color: "#977fbb" }} />
            </IconButton>

            <IconButton
              title="Sair"
              color="inherit"
              sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              onClick={() => setmodalSairOpen(true)}
            >
              <LogoutIcon sx={{ color: "#977fbb" }} />
            </IconButton>
          </Box>
        </Toolbar>

        <Box sx={{ display: { xs: "block", md: "none" }, px: 2, pb: 2 }}>
          <TextField
            placeholder="Buscar produtos..."
            size="small"
            fullWidth
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton size="small" sx={{ color: "primary.main" }}>
                  <Search sx={{ color: "#977fbb" }} />
                </IconButton>
              ),
            }}
          />
        </Box>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          mt: 3,
          minHeight: {
            xs: "calc(100vh - 250px)", // mobile
            sm: "calc(100vh - 220px)", // tablet
            md: "calc(100vh - 200px)", // desktop
          },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: { xs: 135, sm: 100, md: 90 },
            zIndex: 10,
            py: 2,
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
            mb: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#f3e3ec",
              color: "#800080",
              fontFamily: "Quicksand",
            }}
            onClick={() => setopenFinalizarPedido(true)}
          >
            Finalizar pedido
          </Button>
          <Typography variant="h6" sx={{ marginRight: 4, fontSize: 16 }}>
            Total: R$ {formatarMoney(somaTotalComp.toFixed(2))}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <TableListaProdComercial
            onEnviar={setarmDados}
            onRemoverItemAvo={excItemList}
            key={recarregarTabela}
            produto={pesquisaProduto}
          />
        </Box>
        <DadosEmpresa numeroWhatsapp={setnumeroZap} />
        <ListaFinalizarPedido
          open={openFinalizarPedido}
          listaCompra={armDados}
          onRemoverItemFilho={handleRemoverItem}
          onClose={() => setopenFinalizarPedido(false)}
          onFinalizarCompra={(sucesso) => {
            if (sucesso) {
              setarmDados([]);
              setRecarregarTabela((prev) => prev + 1);
            }
          }}
        />

        <ListaPedidosCompraCliente open={modalAcessListaPedidos} onClose={() => setmodalAcessListaPedidos(false)} />
        <FormCliente open={modalOpenPerfilCliente} onClose={() => setmodalOpenPerfilCliente(false)} />
        <ModalSair open={modalSairOpen} onClose={() => setmodalSairOpen(false)} />

        <Toaster position="top-right" reverseOrder={false} />
      </Container>
    </Box>
  );
}

export default TelaPrincipalCliente;
