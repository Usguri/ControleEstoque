import { AppBar, Toolbar, Button, Container, Box } from "@mui/material";
import LogoImagem from "../image/Icone.png";
import { useState } from "react";
import { ModalSair } from "../components/BotaoSair";
import { FormCategoria } from "../components/FormCategoria";
import { FormEmpresa } from "../components/EmpresaForm";
import { FormProduto } from "../components/FormProduto";
import { FormAddNewAcess } from "../components/FormAddNewAcess";
import { ListaPedidosCompra } from "../components/ListaPedidosCompra";

function TelaPrincipal() {
  const [modalSairOpen, setmodalSairOpen] = useState<boolean>(false);
  const [modalAddCategoria, setmodalAddCategoria] = useState<boolean>(false);
  const [modalAddEmpresa, setmodalAddEmpresa] = useState<boolean>(false);
  const [modalAddProduto, setmodalAddProduto] = useState<boolean>(false);
  const [modalAddNewAcess, setmodalAddNewAcess] = useState<boolean>(false);
  const [modalAcessListaPedidos, setmodalAcessListaPedidos] = useState<boolean>(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#e0e0e0" }}>
        <Toolbar>
          <img src={LogoImagem} style={{ width: 80 }} />;
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" color="primary" onClick={() => setmodalAddCategoria(true)}>
            Categoria
          </Button>
          <Button variant="contained" color="warning" sx={{ mx: 0.5 }} onClick={() => setmodalAddProduto(true)}>
            Produto
          </Button>
          <Button variant="contained" color="secondary" sx={{ mx: 0.5 }} onClick={() => setmodalAddEmpresa(true)}>
            Empresa
          </Button>
          <Button variant="contained" color="primary" sx={{ mx: 0.5 }} onClick={() => setmodalAcessListaPedidos(true)}>
            Hist. de Pedidos
          </Button>
          <Button variant="contained" color="success" sx={{ mx: 0.5 }} onClick={() => setmodalAddNewAcess(true)}>
            Acessos
          </Button>
          <Button variant="contained" color="error" sx={{ mx: 0.5 }} onClick={() => setmodalSairOpen(true)}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <ListaPedidosCompra open={modalAcessListaPedidos} onClose={() => setmodalAcessListaPedidos(false)} />
      <ModalSair open={modalSairOpen} onClose={() => setmodalSairOpen(false)} />
      <FormCategoria open={modalAddCategoria} onClose={() => setmodalAddCategoria(false)} />
      <FormEmpresa open={modalAddEmpresa} onClose={() => setmodalAddEmpresa(false)} />
      <FormProduto open={modalAddProduto} onClose={() => setmodalAddProduto(false)} />
      <FormAddNewAcess open={modalAddNewAcess} onClose={() => setmodalAddNewAcess(false)} />

      <Container maxWidth="lg" sx={{ mt: 4 }}></Container>
    </Box>
  );
}

export default TelaPrincipal;
