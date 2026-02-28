import { OrderStatus } from "@/types";
import z from "zod"
import { validatePassword } from "./validation.utils";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required').default('Nigeria'),
  postalCode: z.string().min(3, 'Postal code is required').optional(),
  label: z.string().optional(),
  isDefault: z.boolean().default(false),
})

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>



//================Product Schema
export const productFormSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(200, 'Name must not exceed 200 characters'),
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  categoryId: z.string().min(1, 'Category is required'),
  brand: z.string().max(100, 'Brand must not exceed 100 characters').optional(),
  price: z.number()
    .min(0, 'Price must be positive')
    .max(10000000, 'Price is too high'),
  stock: z.number()
    .min(0, 'Stock must be positive')
    .max(10000, 'Stock is too high'),
  discount: z.number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .default(0),
  tags: z.string().optional(),
  isActive: z.boolean().default(true),
  variantOptions: z.object({
    sizes: z.string().optional(),
    colors: z.string().optional(),
    materials: z.string().optional(),
    genders: z.string().optional(),
  }).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export const productSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12).optional(),
  search: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  tags: z.string().optional(),
  sortBy: z.string().default('createdAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
})

export type IProductQueryFilters = z.infer<typeof productSearchSchema>

//============Order Shcema
export const orderSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  sortBy: z.string().default('createdAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
})

export type IOrderQueryFilters = z.infer<typeof orderSearchSchema>



//========Wallet Schema
export
  const withdrawalSchema = z.object({
    accountHolderName: z.string().min(3, 'Account holder name is required'),
    bankName: z.string().min(3, 'Bank name is required'),
    accountNumber: z.string().min(10, 'Account number must be at least 10 digits'),
    amount: z.number().min(1000, 'Minimum withdrawal is ₦1,000'),
  });

export type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

//=============Settings Schema
export const settingsSchema = z.object({
  businessName: z.string().min(3, 'Business name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  description: z.string().optional(),
  location: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
  }),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;




//=============Profile Schemas
export const userUpdateSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Phone must be at least 10 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
});

export const vendorUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  businessName: z.string().min(2).optional(),
  description: z.string().optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  location: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

export const adminUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().optional(),
  permissions: z.object({
    manageProducts: z.boolean().optional(),
    manageOrders: z.boolean().optional(),
    managePayments: z.boolean().optional(),
  }).optional(),
});



//===========Auth Schemas
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  const validation = validatePassword(data.newPassword);
  return validation.valid;
}, {
  message: "Password must contain uppercase, lowercase, number, and special character",
  path: ["newPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>


export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>


//Admin
export const adminSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  storeName: z.string().min(2, 'Store name is required'),
  businessType: z.enum(['boutique', 'brand', 'retailer', 'other']),
  businessDescription: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  requestPermissions: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  const validation = validatePassword(data.password);
  return validation.valid;
}, {
  message: "Password must contain uppercase, lowercase, number, and special character",
  path: ["password"],
});

export type AdminSignupFormData = z.infer<typeof adminSignupSchema>;

//Vendor
export const vendorSignupSchema = z
  .object({
    fullName: z.string("Invalid name"),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    businessName: z.string().min(3, 'Store name must be at least 3 characters'),
    description: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    location: z.object({
      street: z.string().min(1, 'Street address is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      country: z.string().min(1, 'Country is required'),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type VendorSignupFormData = z.infer<typeof vendorSignupSchema>


//User
export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  const validation = validatePassword(data.password);
  return validation.valid;
}, {
  message: "Password must contain uppercase, lowercase, number, and special character",
  path: ["password"],
});

export type SignupFormData = z.infer<typeof signupSchema>;
