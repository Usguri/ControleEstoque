import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useAuth } from "../hooks/useAuth";

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

export const ModalSair = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { logout } = useAuth();
  if (!open) return null;

  return (
    <div>
      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: "center" }}>
            Tem certeza que deseja sair?
          </Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <Button variant="contained" color="primary" size="small" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="error" size="small" onClick={() => logout()}>
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
