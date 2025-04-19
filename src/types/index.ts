export interface Brand {
    id: string
    name: string
}

export interface Product {
    id: string
    name: string
    price: number
    description?: string
    image?: string // base64
    brandId: string
    brand?: Brand
}
