import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/services";
import { ValidaAcessoLogin } from "../utils/validacoes";
import type { AcessosSistema } from "../types/acessosSistema.types";

const AuthContext = createContext<{
  user: AcessosSistema | null;
  login: (email: string, password: string) => Promise<AcessosSistema | false>;
  logout: () => Promise<void>;
  loading: boolean;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AcessosSistema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.verificaLogin();
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const retorno = ValidaAcessoLogin(email, password);
    if (retorno.success) {
      toast.error(retorno.message);
      return false;
    }

    try {
      const response = await authService.login(email, password);

      if (response.success || !response.dados?.[0]?.userAtivo) {
        toast.error(response.message);
        return false;
      }

      if (response.dados[0].primeiroAcesso) {
        setUser(response.dados[0]);
      }

      return response.dados[0];
    } catch {
      toast.error("Usuário ou senha incorretos!");
      return false;
    }
  };

  const logout = async () => {
    await authService.realizaLogout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
