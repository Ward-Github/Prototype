import React from 'react';
import { useAdminMode } from '@/context/AdminModeContext';

import AdminHome from '@/components/Home/AdminHome';
import UserHome from '@/components/Home/UserHome';

export default function TabOneScreen() {
  const { isAdminMode } = useAdminMode();

  if (!isAdminMode) {
    return <UserHome />;
  }

  return <AdminHome />;
}