import React from 'react';
import { useTokenRefresh } from '@/hooks';
import { useValidateToken } from '@/api/queries/auth.query';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setAuth, clearAuth, setLoading, setAuthAdmin } = useAuthStore();
  const { data: validationData, isLoading: isValidating } = useValidateToken();
  
  useTokenRefresh();

  React.useEffect(() => {
     if (!isValidating && validationData) {
       if (!validationData.valid) {
         clearAuth()
         setLoading(false)
         return
       }
 
       const user = validationData.user
 
       switch (user.role) {
         case UserRole.ADMIN:
         case UserRole.SUPER_ADMIN:
           setAuthAdmin(user) // ✅ IAdmin
           break
 
         default:
           clearAuth()
       }
 
       setLoading(false)
     }
   }, [validationData, isValidating, setAuth, clearAuth, setLoading]);

  return <>{children}</>;
};