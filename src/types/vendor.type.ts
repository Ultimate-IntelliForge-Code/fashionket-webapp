import type { IBaseDocument, IBaseUser, ITimestamps } from "./base.types";
import type { UserRole } from "./enums";


export interface ILocation {
  street: string;
  city: string;
  state: string;
  country: string;
  lat?: string;
  lng?: string;
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
  fullName: string;
  businessName: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  phone: string;
  role: UserRole.VENDOR;
  isActive: boolean;
  verified: boolean;
  accountStatus: AccountStatus;
  location: ILocation;
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
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  description?: string;
  password: string;
  location: IVendorAddress
}

export interface IVendorAddress {
  street: string;
  city: string;
  state: string;
  country: string;
}

/**
 * Vendor update payload
 */
export interface IUpdateVendorPayload {
  fullName?: string;
  description?: string;
  location?: IVendorAddress;
  phone?: string;
}

/**
 * Vendor login response
 */
export interface IVendorAuthResponse {
  success: boolean;
  message: string;
  data: IVendor;
}