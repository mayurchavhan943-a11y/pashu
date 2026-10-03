import { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          localStorage.setItem("pashucare_user", JSON.stringify(userData));
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      // Assuming response contains { token, user: { ... } }
      // Or maybe token is just returned and we have to decode or fetch user?
      // Let's store token and then fetch user.
      localStorage.setItem("token", data.token);
      
      let userData = data.user;
      if (!userData) {
          userData = await authService.getCurrentUser();
      }
      
      localStorage.setItem("pashucare_user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      // Sometimes register also logs in, sometimes it doesn't.
      if (data.token) {
        localStorage.setItem("token", data.token);
        let registeredUser = data.user;
        if (!registeredUser) {
           registeredUser = await authService.getCurrentUser();
        }
        localStorage.setItem("pashucare_user", JSON.stringify(registeredUser));
        setUser(registeredUser);
        return registeredUser;
      }
      return data;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pashucare_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
