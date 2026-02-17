import React from 'react';
import { useTokenRefresh } from '@/hooks';
import { useValidateToken } from '@/api/queries/auth.query';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';

export const VendorAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { clearAuth, setLoading, setAuthVendor } = useAuthStore();
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

         case UserRole.VENDOR:
           setAuthVendor(user) // ✅ IVendor
           break
 
         default:
           clearAuth()
       }
 
       setLoading(false)
     }
   }, [validationData, isValidating, clearAuth, setLoading]);

  return <>{children}</>;
};