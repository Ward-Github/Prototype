import { ReactNode, createContext, useEffect, useContext, useState } from "react";
import { router, useSegments } from "expo-router";
import { Platform } from "react-native";

type User = {
  id: string;
  email: string;
  name: string;
  licensePlate: string;
  admin: boolean;
  pfp: string;
  theme: 'light' | 'dark';
};

type AuthContextType = {
  user: User | null;
  login: (id: string, email: string, name: string, licensePlate: string, admin: boolean, pfp: string, theme: 'light' | 'dark') => boolean;
  logout: () => void;
};

function useProtectedRoute(user: User | null) {
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && inAuthGroup) {
      router.replace("/login");
    } else if (user && !inAuthGroup) {
      if (Platform.OS === "web") {
        router.replace("/(auth)/(tabs web)/");
      } else {
        router.replace("/(auth)/(tabs)/");
      }
    }
  }, [user, segments]);
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a <AuthProvider />");
  }
  return context;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (id: string, email: string, name: string, licensePlate: string, admin: boolean, pfp: string, theme: 'light' | 'dark') => {
    setUser({
      id,
      email,
      name,
      licensePlate,
      admin,
      pfp,
      theme,
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
