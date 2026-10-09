import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { formatarMoney } from "../utils/formatadores";
import type { ProdutoListagem, ListaProdutosComprar } from "../types/produtos.type";
import { useEffect, useMemo, useState } from "react";
import { useListaCompras } from "../hooks/useListaCompras";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import toast, { Toaster } from "react-hot-toast";
import type { listaProdComer } from "../types/listaProdComer.types";

export default function TableListaProdComercial({
  onEnviar,
  onRemoverItemAvo,
  produto,
}: {
  onEnviar: React.Dispatch<React.SetStateAction<listaProdComer[]>>;
  onRemoverItemAvo?: number;
  produto: string;
}) {
  const { ListaProdComercial } = useListaCompras();
  const [todosProdutos, settodosProdutos] = useState<ProdutoListagem[]>([]);
  const [indexAtivo, setIndexAtivo] = useState<{ [id: number]: number }>({});
  const [carrinho, setCarrinho] = useState<ListaProdutosComprar[]>([]);
  const [armDadosTemp, setarmDadosTemp] = useState<ProdutoListagem[]>([]);

  const ITEMS_PER_LOAD = 12;
  const [itemsVisiveis, setItemsVisiveis] = useState(12);
  const produtosVisiveis = useMemo(() => {
    return todosProdutos.slice(0, itemsVisiveis);
  }, [todosProdutos, itemsVisiveis]);
  const temMais = itemsVisiveis < todosProdutos.length;

  useEffect(() => {
    const load = async () => {
      settodosProdutos([]);
      setIndexAtivo({});
      setCarrinho([]);

      const data = await ListaProdComercial();
      settodosProdutos(data);
      setarmDadosTemp(data);
    };

    if (onRemoverItemAvo) {
      VoltaQuantOriginalEstoq(onRemoverItemAvo);
    }

    load();
  }, [onRemoverItemAvo, produto]);

  useEffect(() => {
    if (armDadosTemp.length > 0) {
      SelecionaDeterminadoProduto(produto);
    }
  }, [produto, armDadosTemp]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200 && temMais) {
        setItemsVisiveis((prev) => prev + ITEMS_PER_LOAD);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [temMais]);

  const nextImage = (id: number, imagens: string[]) => {
    setIndexAtivo((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) + 1) % imagens.length,
    }));
  };

  const prevImage = (id: number, imagens: string[]) => {
    setIndexAtivo((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) - 1 + imagens.length) % imagens.length,
    }));
  };

  function VoltaQuantOriginalEstoq(onRemoverItemAvo: number) {
    // Encontra o item no carrinho para pegar a quantidade
    const itemCarrinho = carrinho.find((item) => item.idProduto === onRemoverItemAvo);

    if (itemCarrinho) {
      // Devolve ao estoque
      settodosProdutos((prev) =>
        prev.map((produto) =>
          produto.idProduto === onRemoverItemAvo
            ? { ...produto, quantidadeAtual: (produto.quantidadeAtual || 0) + itemCarrinho.quantidade }
            : produto,
        ),
      );

      setCarrinho((prev) => prev.filter((item) => item.idProduto !== onRemoverItemAvo));
      onEnviar((prev) => prev.filter((item) => item.idProduto !== onRemoverItemAvo));
    }
  }

  function handleQuantidadeChange(idProduto: number, novaQtd: number, valor: number) {
    setCarrinho((prev) => {
      const itemExiste = prev.find((item) => item.idProduto === idProduto);
      const qtdAnterior = itemExiste?.quantidade || 0;
      const diferenca = novaQtd - qtdAnterior;

      // Busca o produto para validar estoque
      const produto = todosProdutos.find((p) => p.idProduto == idProduto);
      const estoqueDisponivel = produto?.quantidadeAtual || 0;

      // Valida se há estoque suficiente
      if (diferenca > 0 && estoqueDisponivel < diferenca) {
        toast.error("Estoque insuficiente!");
        return prev;
      }

      // Atualiza quantidadeAtual do produto
      settodosProdutos((prevProdutos) =>
        prevProdutos.map((produto) =>
          produto.idProduto == idProduto
            ? { ...produto, quantidadeAtual: (produto.quantidadeAtual || 0) - diferenca }
            : produto,
        ),
      );

      EnviarDadosTotalCompra(idProduto, novaQtd, valor);

      if (novaQtd === 0) {
        return prev.filter((item) => item.idProduto != idProduto);
      }

      if (itemExiste) {
        return prev.map((item) => (item.idProduto == idProduto ? { ...item, quantidade: novaQtd } : item));
      }

      return [...prev, { idProduto, quantidade: novaQtd }];
    });
  }

  function EnviarDadosTotalCompra(codProd: number, quant: number, valor: number) {
    onEnviar((prev) => {
      const existe = prev.find((item) => item.idProduto == codProd);

      if (existe && quant === 0) {
        return prev.filter((item) => item.idProduto !== codProd);
      } else if (existe) {
        return prev.map((item) => (item.idProduto === codProd ? { ...item, quant: quant } : item));
      }

      const novoItem: listaProdComer = {
        idProduto: codProd,
        quant: quant,
        value: valor,
      };

      return [...prev, novoItem];
    });
  }

  function SelecionaDeterminadoProduto(produto: string) {
    if (produto === "") {
      settodosProdutos(armDadosTemp);
      return;
    }

    const produtoEncontrado = armDadosTemp.filter(
      (p) => p.nomeProduto?.toLowerCase().includes(produto.toLowerCase()) || p.codProduto?.toString().includes(produto),
    );

    settodosProdutos(produtoEncontrado.length > 0 ? produtoEncontrado : armDadosTemp);
  }

  return (
    <Grid container spacing={1}>
      {produtosVisiveis.map((product) => {
        const imagens = product.imagemProduto?.filter((img): img is string => typeof img === "string") || [];
        const atual = indexAtivo[product.idProduto] ?? 0;

        const getImageUrl = (caminho: string) => {
          return `${import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://api.vmsystems.cloud"}/${caminho}`;
        };

        const getQuantidade = (idProduto: number) => {
          return carrinho.find((item) => item.idProduto === idProduto)?.quantidade || 0;
        };

        const quantidade = getQuantidade(product.idProduto);

        return (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={product.idProduto}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    bgcolor: "#ECDAEA",
                    color: "#800080",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 12,
                    fontFamily: "Quicksand",
                    boxShadow: 2,
                  }}
                >
                  {atual + 1}/{imagens.length}
                </Box>

                {imagens.length > 0 && (
                  <CardMedia
                    component="img"
                    height="300"
                    sx={{
                      objectFit: "contain",
                      px: 2,
                    }}
                    image={getImageUrl(imagens[atual])}
                    loading="lazy"
                  />
                )}

                {imagens.length > 1 && (
                  <IconButton
                    onClick={() => prevImage(product.idProduto, imagens)}
                    sx={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                      },
                      boxShadow: 2,
                    }}
                    size="small"
                  >
                    <ChevronLeft />
                  </IconButton>
                )}

                {imagens.length > 1 && (
                  <IconButton
                    onClick={() => nextImage(product.idProduto, imagens)}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                      },
                      boxShadow: 2,
                    }}
                    size="small"
                  >
                    <ChevronRight />
                  </IconButton>
                )}
              </Box>

              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "space-between",
                  pb: 1,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  {product.descricao && (
                    <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
                      <Typography component="span" sx={{ fontWeight: "bold", mr: 0.5, fontFamily: "Quicksand" }}>
                        Descrição:
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: 14,
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                          fontFamily: "Quicksand",
                          lineHeight: "1.8",
                        }}
                      >
                        {product.descricao}
                      </Typography>
                    </Typography>
                  )}

                  <Typography variant="body2" sx={{ display: "flex" }}>
                    <Typography component="span" sx={{ fontWeight: "bold", mr: 0.5, fontFamily: "Quicksand" }}>
                      Nome:
                    </Typography>
                    <Typography component="span" sx={{ fontFamily: "Quicksand" }}>
                      {product.nomeProduto}
                    </Typography>
                  </Typography>

                  <Typography variant="body2" sx={{ display: "flex" }}>
                    <Typography component="span" sx={{ fontWeight: "bold", mr: 0.5, fontFamily: "Quicksand" }}>
                      Cod:
                    </Typography>
                    <Typography component="span" sx={{ fontFamily: "Quicksand" }}>
                      {product.codProduto}
                    </Typography>
                  </Typography>

                  {product.promocao && (
                    <>
                      <Typography>
                        <Typography component="span" sx={{ fontSize: 16, mr: 0.5, fontFamily: "Quicksand" }}>
                          R$ {formatarMoney(product.precoPromocao)}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ fontSize: 12, color: "rgba(0, 0, 0, .55)", fontFamily: "Quicksand" }}
                        >
                          Un
                        </Typography>
                      </Typography>
                    </>
                  )}

                  {!product.promocao && (
                    <Typography>
                      <Typography component="span" sx={{ fontSize: 16, mr: 0.5, fontFamily: "Quicksand" }}>
                        R$ {formatarMoney(product.preco)}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{ fontSize: 12, color: "rgba(0, 0, 0, .55)", fontFamily: "Quicksand" }}
                      >
                        Un
                      </Typography>
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontFamily: "Quicksand" }}>
                    Estoque: {product.quantidadeAtual}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 2 }}>
                  <Button
                    sx={{ backgroundColor: "#ECDAEA" }}
                    variant="contained"
                    size="small"
                    onClick={() =>
                      handleQuantidadeChange(
                        product.idProduto,
                        Math.max(0, quantidade - 1),
                        Number(product.promocao ? product.precoPromocao : product.preco),
                      )
                    }
                  >
                    <RemoveIcon sx={{ color: "#800080", fontSize: 18 }} />
                  </Button>

                  <Typography sx={{ minWidth: 30, textAlign: "center", fontSize: 18, fontFamily: "Quicksand" }}>
                    {quantidade}
                  </Typography>

                  <Button
                    sx={{ backgroundColor: "#ECDAEA" }}
                    variant="contained"
                    size="small"
                    onClick={() =>
                      handleQuantidadeChange(
                        product.idProduto,
                        quantidade + 1,
                        Number(product.promocao ? product.precoPromocao : product.preco),
                      )
                    }
                  >
                    <AddIcon sx={{ color: "#800080", fontSize: 18 }} />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}{" "}
      {temMais && (
        <Grid size={12}>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </Grid>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </Grid>
  );
}
