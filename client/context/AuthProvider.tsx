import { ReactNode, createContext, useEffect } from "react";
import { useContext, useState } from "react";
import { router, useSegments } from "expo-router";
import { Platform } from "react-native";

type User = {
  id: string;
  email: string;
  name: string;
  licensePlate: string;
  admin: boolean;
  pfp: string;
};

type AuthProvider = {
  user: User | null;
  login: (id:string, email: string, name: string, licensePlate:string, admin:boolean, pfp: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
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

export const AuthContext = createContext<AuthProvider>({
  user: null,
  login: () => false,
  logout: () => {},
  isAdmin: () => false,
});

export function useAuth() {
  if (!useContext(AuthContext)) {
    throw new Error("useAuth must be used within a <AuthProvider />");
  }

  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (id: string, email: string, name:string, licensePlate:string, admin:boolean, pfp:string) => {
    setUser({
      id: id,
      email: email,
      name: name,
      licensePlate: licensePlate,
      admin: admin,
      pfp: pfp,
    });

    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => {
    return user?.admin ?? false;
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}