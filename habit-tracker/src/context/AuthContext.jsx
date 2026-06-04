import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ht_user") || "null");
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    if (!email || !password) return "Please fill in all fields.";
    const u = {
      id: btoa(email),
      email,
      name: email.split("@")[0],
      avatar: email[0].toUpperCase(),
    };
    setUser(u);
    localStorage.setItem("ht_user", JSON.stringify(u));
    return null;
  };

  const signup = (email, password) => {
    if (!email || !password) return "Please fill in all fields.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    const u = {
      id: btoa(email),
      email,
      name: email.split("@")[0],
      avatar: email[0].toUpperCase(),
    };
    setUser(u);
    localStorage.setItem("ht_user", JSON.stringify(u));
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ht_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
