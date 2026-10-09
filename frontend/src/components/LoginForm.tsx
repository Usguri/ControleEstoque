import { useState } from "react";
import { TextField, Button, Stack, CircularProgress, Box } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AlterarSenhaUsuario } from "./AlterarSenhaUsuario";

export default function LoginForm() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setloading] = useState<boolean>(false);
  const [modalAlterarSenha, setmodalAlterarSenha] = useState<boolean>(false);
  const [armIdUsuarioTemp, setarmIdUsuarioTemp] = useState<number>(0);

  async function acessarSistema() {
    setloading(true);
    const retorno = await login(usuario, senha);
    if (retorno) {
      if (!retorno.primeiroAcesso) {
        setarmIdUsuarioTemp(retorno.idUsuario);
        setmodalAlterarSenha(true);
      } else {
        setTimeout(() => {
          navigate(retorno.role === 1 ? "/Tela-principal" : "/Tela-principal-cliente");
        }, 100);
        setUsuario("");
        setSenha("");
      }
    }

    setloading(false);
  }

  return (
    <Stack spacing={2}>
      <TextField
        label="Usuario"
        size="small"
        type="usuario"
        fullWidth
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />
      <TextField
        label="Senha"
        size="small"
        type="password"
        fullWidth
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      <Button
        variant="contained"
        color="secondary"
        size="large"
        style={{ backgroundColor: "#9483bc", borderRadius: 6 }}
        onClick={acessarSistema}
      >
        Entrar
      </Button>
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
      <AlterarSenhaUsuario
        open={modalAlterarSenha}
        idUsuario={armIdUsuarioTemp}
        onClose={(sucesso) => {
          setmodalAlterarSenha(false);
          setloading(false);
          if (sucesso) {
            setUsuario("");
            setSenha("");
          }
        }}
      />
      <Toaster position="top-right" reverseOrder={false} />
    </Stack>
  );
}
