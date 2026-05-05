import { useQuery } from "@tanstack/react-query"
import { adminProfile, userProfile, vendorProfile } from "../queries"

export const useUserProfile = () => {
  return useQuery(userProfile())
}

export const useVendorProfile = () => {
  return useQuery(vendorProfile())
}

export const useAdminProfile = () => {
  return useQuery(adminProfile())
}