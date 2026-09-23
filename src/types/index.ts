export type Product = {
  id: string
  sku: string
  name: string
  description: string
  price: number
  stock: number
  minimumStock: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export type PageResponse<T> = {
  list: T[]
  page: number
  size: number
  totalRecord: number
  totalPage: number
}

export type AuthTokenResponse = {
  token: string
}

export type UserRole = 'ADMIN' | 'DUENO' | 'VENDEDOR'

export type MenuPermission = {
  permissionId: string
  code: string
  name: string
}

export type MenuScreen = {
  screenId: string
  code: string
  name: string
  route: string
  permissions: MenuPermission[]
}

export type RegisterResponse = {
  companyId: string
  userId: string
  role: string
}

export type SaleItem = {
  productId: string
  sku?: string
  productName?: string
  quantity: number
  unitPrice?: number
}

export type Sale = {
  id: string
  saleItemList: SaleItem[]
  total: number
  createdAt: string
}

export type ProductForm = {
  sku: string
  name: string
  description: string
  price: string
  stock: string
  minimumStock: string
}

export type Role = { id: string; code: string; name: string }
export type Screen = { id: string; code: string; name: string; route: string }
export type Permission = { id: string; code: string; name: string; screenId: string }
export type User = {
  id: string
  tenantId: string
  email: string
  roleId: string | null
  roleCode: string | null
  active: boolean
}
