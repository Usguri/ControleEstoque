import { Box, Container, Typography, Paper } from "@mui/material";
import LoginForm from "../components/LoginForm";
import LogoImagem from "../image/Icone.png";

function Login() {
  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "98vh",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: "100%" }}>
          <Box
            sx={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
            mb={3}
          >
            <img src={LogoImagem} style={{ width: 100 }} />
          </Box>
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              Princesa acessórios
            </Typography>
          </Box>
          <LoginForm />
        </Paper>
      </Container>
    </>
  );
}

export default Login;
