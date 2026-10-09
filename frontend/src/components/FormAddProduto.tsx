import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  TextareaAutosize,
  type SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { produtoVazio, type DadosProdutos } from "../types/produtos.type";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAddProdutos } from "../hooks/useAddProduto";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { formatarValor } from "../utils/formatadores";
import { type Categoria } from "../types/categoria.types";
import { validarProduto, temErros } from "../utils/validacoes";
import type { ErrosProduto, ImagemProduto } from "../types/produtos.type";
import { CircularProgress } from "@mui/material";

export const FormAddProduto = ({
  open,
  onClose,
  idProduto,
}: {
  open: boolean;
  onClose: () => void;
  idProduto: number | undefined;
}) => {
  const [produto, setProduto] = useState<DadosProdutos>(produtoVazio);
  const { SalvarNovoProduto, ListCategoriasAtivas, BuscarProdutoEditar, SalvarEdicaoProduto, ExcluirImagemPasta } =
    useAddProdutos();
  const [listCategorias, setlistCategorias] = useState<Categoria[]>([]);
  const [ativaEdit, setativaEdit] = useState<boolean>(false);
  const [erros, setErros] = useState<ErrosProduto>({});
  const [nomeAcao, setnomeAcao] = useState<string>("Salvar produto");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      const lista = await ListCategoriasAtivas();
      setlistCategorias(lista);
      setProduto(produtoVazio);

      if (idProduto) {
        setativaEdit(true);
        setnomeAcao("Salvar Edição");
        await BuscarProdutoEditar(idProduto).then((dados) => {
          setProduto({
            ...dados,
            imagemProduto: dados.imagemProduto || [],
          });
        });
      }
    };

    load();
  }, [open, idProduto]);
  if (!open) return null;

  const handleCategoriaChange = (event: SelectChangeEvent<string>) => {
    setProduto({ ...produto, idCategoria: event.target.value });
  };

  const handleNomeProdutoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProduto({ ...produto, nomeProduto: event.target.value });
  };

  const handleCodProdutoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProduto({ ...produto, codProduto: event.target.value });
  };

  const handlePrecoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProduto({ ...produto, preco: formatarValor(event.target.value) });
  };

  const handleQuantidadeCompradaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(event.target.value))) {
      toast.error("Não aceita letras!");
      return false;
    }
    setProduto({ ...produto, quantidadeComprada: Number(event.target.value) });
  };

  const handleQuantidadeAtualChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(event.target.value))) {
      toast.error("Não aceita letras!");
      return false;
    }
    setProduto({ ...produto, quantidadeAtual: Number(event.target.value) });
  };

  const handlePrecoPromocaoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProduto({ ...produto, precoPromocao: formatarValor(event.target.value) });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > maxSizeBytes) {
        rejectedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (rejectedFiles.length > 0) {
      toast.error(`Imagens muito grandes: ${rejectedFiles.join(", ")}`);
      return false;
    }

    if (validFiles.length > 0) {
      setProduto((prev) => ({
        ...prev,
        imagemProduto: [...(prev.imagemProduto || []), ...validFiles],
      }));
    }
  };

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files) {
  //     setProduto((prev) => ({
  //       ...prev,
  //       imagemProduto: [...(prev.imagemProduto || []), ...Array.from(files)],
  //     }));
  //   }
  // };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProduto({ ...produto, statusProduto: event.target.checked });
  };

  const handlePromocaoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProduto({ ...produto, promocao: event.target.checked });
  };

  const handleDescricaoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProduto({ ...produto, descricao: event.target.value });
  };

  const handleDimensoesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProduto({ ...produto, dimensoes: event.target.value });
  };

  const handleRemoveFile = (index: number, nomeArq: string, idproduto: number | undefined) => {
    setProduto((produto) => ({
      ...produto,
      imagemProduto: produto.imagemProduto.filter((_, i) => i !== index),
    }));

    if (nomeArq != undefined) {
      ExcluirImagemPasta(nomeArq, idproduto);
    }
  };

  const handleSalvar = async () => {
    const novosErros = validarProduto(produto);

    if (temErros(novosErros)) {
      setErros(novosErros);
      return;
    }

    setLoading(true);

    try {
      if (ativaEdit) {
        setativaEdit(false);
        await SalvarEdicaoProduto(produto);
      } else {
        await SalvarNovoProduto(produto);
      }
      setTimeout(() => {
        onClose();
        setLoading(false);
      }, 400);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao salvar:", error);
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
              Novo Produto
            </Typography>
          </Box>

          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <Box style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Box style={{ display: "flex", gap: "8px" }}>
                <FormControl sx={{ flex: 1 }} size="small">
                  <InputLabel id="demo-select-small-label">Categoria</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    label="Categoria"
                    value={produto.idCategoria}
                    onChange={handleCategoriaChange}
                    error={erros.categoria}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {listCategorias.map((c) => (
                      <MenuItem key={c.idCategoria} value={c.idCategoria}>
                        {c.categoria}
                      </MenuItem>
                    ))}
                  </Select>
                  {erros.categoria && <FormHelperText>Campo obrigatório</FormHelperText>}
                </FormControl>
                <TextField
                  id="outlined-basic"
                  label="Produto"
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                  value={produto.nomeProduto}
                  onChange={handleNomeProdutoChange}
                  error={erros.nomeProduto}
                  helperText={erros.nomeProduto ? "Campo obrigatório" : ""}
                />
                <TextField
                  id="outlined-basic"
                  label="Cod.Produto"
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                  value={produto.codProduto}
                  required
                  onChange={handleCodProdutoChange}
                  error={erros.codProduto}
                  helperText={erros.codProduto ? "Campo obrigatório" : ""}
                />
              </Box>

              <Box style={{ display: "flex", gap: "8px" }}>
                <TextField
                  id="outlined-basic"
                  label="Preço"
                  variant="outlined"
                  size="small"
                  value={produto.preco}
                  required
                  onChange={handlePrecoChange}
                  error={erros.preco}
                  helperText={erros.preco ? "Campo obrigatório" : ""}
                  inputProps={{ maxLength: 6 }}
                  sx={{ flex: 1 }}
                  slotProps={{
                    input: {
                      startAdornment: <AttachMoneyIcon fontSize="small" />,
                    },
                  }}
                />

                {idProduto && (
                  <TextField
                    id="outlined-basic"
                    label="Quantidade atual"
                    variant="outlined"
                    size="small"
                    value={produto.quantidadeAtual}
                    sx={{ flex: 1 }}
                    onChange={handleQuantidadeAtualChange}
                  />
                )}

                {!idProduto && (
                  <TextField
                    id="outlined-basic"
                    label="Quantidade comprada"
                    variant="outlined"
                    size="small"
                    value={produto.quantidadeComprada}
                    sx={{ flex: 1 }}
                    onChange={handleQuantidadeCompradaChange}
                  />
                )}

                <TextField
                  id="outlined-basic"
                  label="Preço em promoção"
                  variant="outlined"
                  size="small"
                  value={produto.precoPromocao || ""}
                  disabled={!produto.promocao}
                  sx={{ flex: 1 }}
                  inputProps={{ maxLength: 6 }}
                  onChange={handlePrecoPromocaoChange}
                  slotProps={{
                    input: {
                      startAdornment: <AttachMoneyIcon fontSize="small" />,
                    },
                  }}
                />
              </Box>

              <Box style={{ display: "flex", gap: "8px" }}>
                <TextareaAutosize
                  id="outlined-basic"
                  placeholder="Informe uma descrição"
                  value={produto.descricao || ""}
                  style={{ flex: 1, height: 80, resize: "none" }}
                  onChange={handleDescricaoChange}
                />
                <TextareaAutosize
                  id="outlined-basic"
                  placeholder="Informe a referência"
                  value={produto.dimensoes || ""}
                  style={{ flex: 1, height: 80, resize: "none" }}
                  onChange={handleDimensoesChange}
                />
              </Box>

              <Box style={{ display: "flex", gap: "8px" }}>
                <FormControlLabel
                  label="Status"
                  control={
                    <Switch
                      slotProps={{ input: { "aria-label": "controlled" } }}
                      checked={produto.statusProduto}
                      onChange={handleStatusChange}
                    />
                  }
                />
                <FormControlLabel
                  label="Promoção"
                  control={
                    <Switch
                      slotProps={{ input: { "aria-label": "controlled" } }}
                      checked={produto.promocao}
                      onChange={handlePromocaoChange}
                    />
                  }
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                  Upload files
                  <VisuallyHiddenInput type="file" multiple onChange={handleFileUpload} />
                </Button>
              </Box>

              {produto.imagemProduto?.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1, maxHeight: 200, overflow: "auto" }}>
                  {produto.imagemProduto.map((file, index) => {
                    const isFile = file instanceof File;
                    const isString = typeof file === "string";

                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          p: 1,
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      >
                        <img
                          src={
                            file instanceof File
                              ? URL.createObjectURL(file)
                              : `${import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://api.vmsystems.cloud"}/${(file as ImagemProduto).caminho}`
                          }
                          alt={`Imagem ${index + 1}`}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                          loading="lazy"
                        />
                        <span style={{ flex: 1 }}>
                          {isFile ? file.name : isString ? file : (file as ImagemProduto).nome.replace(/^\d+_/, "")}
                        </span>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() =>
                            handleRemoveFile(
                              index,
                              isFile ? file.name : isString ? file : (file as ImagemProduto).nome,
                              produto.idProduto,
                            )
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSalvar}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? "Salvando..." : nomeAcao}
                </Button>
              </Box>
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
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "70%", sm: "60%", md: "50%", lg: 900, xl: 850 },
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 4,
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
