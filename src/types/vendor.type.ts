import type { IBaseDocument, IBaseUser, ITimestamps } from "./base.types";
import type { UserRole } from "./enums";

export interface IVendorLocation {
  lat?: number;
  lng?: number;
  street: string;
  city: string;
  state: string;
  country: string;
}

export enum AccountStatus {
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

/**
 * Vendor base interface (excluding sensitive fields)
 */
export interface IVendor extends IBaseDocument, ITimestamps, IBaseUser {
  fullName?: string;
  businessName: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  idDocument?: string;
  phone?: string;
  role: UserRole.VENDOR;
  isActive: boolean;
  verified: boolean;
  accountStatus: AccountStatus;
  location: IVendorLocation;
  ratingAverage: number;
  ratingCount: number;
  googleId?: string | null;
}

/**
 * Vendor with password (for backend use only)
 */
export interface IVendorWithPassword extends IVendor {
  passwordHash: string;
  refreshToken?: string | null;
}

/**
 * Vendor creation payload
 */
export interface ICreateVendorPayload {
  email: string;
  password: string;
  businessName: string;
  fullName?: string;
  description?: string;
  logoUrl?: string;
  idDocument?: string;
  phone?: string;
  location: IVendorLocation;
}

/**
 * Vendor update payload
 */
export interface IUpdateVendorPayload {
  fullName?: string;
  email?: string;
  businessName?: string;
  description?: string;
  logoUrl?: string;
  idDocument?: string;
  phone?: string;
  location?: Partial<IVendorLocation>;
}

/**
 * Vendor login response
 */
export interface IVendorAuthResponse {
  success: boolean;
  message: string;
  data: IVendor;
}

/**
 * Vendor profile response
 */
export interface IVendorProfileResponse {
  success: boolean;
  data: IVendor;
}