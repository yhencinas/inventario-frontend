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
