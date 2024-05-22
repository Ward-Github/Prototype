import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface AdminModeContextType {
  isAdminMode: boolean;
  setIsAdminMode: Dispatch<SetStateAction<boolean>>;
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined);

export const useAdminMode = () => {
  const context = useContext(AdminModeContext);
  if (!context) {
    throw new Error('useAdminMode must be used within an AdminModeProvider');
  }
  return context;
};

interface AdminModeProviderProps {
  children: ReactNode;
}

export const AdminModeProvider: React.FC<AdminModeProviderProps> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  return (
    <AdminModeContext.Provider value={{ isAdminMode, setIsAdminMode }}>
      {children}
    </AdminModeContext.Provider>
  );
};
