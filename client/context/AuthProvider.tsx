import { ReactNode, createContext, useEffect } from "react";
import { useContext, useState } from "react";
import { router, useSegments } from "expo-router";

type User = {
  username: string;
  accessToken: string;
};

type AuthProvider = {
  user: User | null;
  login: (username: string, accessToken: string) => boolean;
  logout: () => void;
};

function useProtectedRoute(user: User | null) {
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && inAuthGroup) {
      router.replace("/login");
    } else if (user && !inAuthGroup) {
      router.replace("/(auth)/(tabs)/");
    }
  }, [user, segments]);
}

export const AuthContext = createContext<AuthProvider>({
  user: null,
  login: () => false,
  logout: () => {},
});

export function useAuth() {
  if (!useContext(AuthContext)) {
    throw new Error("useAuth must be used within a <AuthProvider />");
  }

  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, accessToken: string) => {
    setUser({
      username: username,
      accessToken: accessToken,
    });

    return true;
  };

  const logout = () => {
    setUser(null);
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}