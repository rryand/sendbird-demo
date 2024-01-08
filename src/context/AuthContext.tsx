import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token: "",
  loginUser: (token: string) => {},
});

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  const loginUser = (token: string) => {
    setIsLoggedIn(true);
    setToken(token);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, loginUser, token }}>
      { children }
    </AuthContext.Provider>
  );
}
