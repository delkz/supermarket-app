import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Brand, Product } from '@/types'



export async function GET(request: NextRequest) {
    try {
        const productsPath = path.join(process.cwd(), 'data', 'products.json')
        const brandsPath = path.join(process.cwd(), 'data', 'brands.json')

        const [productsData, brandsData] = await Promise.all([
            fs.readFile(productsPath, 'utf-8'),
            fs.readFile(brandsPath, 'utf-8')
        ])

        const products: Product[] = JSON.parse(productsData)
        const brands: Brand[] = JSON.parse(brandsData)

        const searchParams = new URL(request.url).searchParams
        const nameFilter = searchParams.get('name')?.toLowerCase()

        let filteredProducts = products

        if(nameFilter){
            filteredProducts = products.filter(product => product.name.toLowerCase().includes(nameFilter))
        }

        const result = filteredProducts.map(product => {
            const brand = brands.find(brand => brand.id === product.brandId)
            return {
                ...product,
                brand,
                brandId: undefined
            }
        })

        return NextResponse.json(result)

        
    } catch (error) {
        console.error('Erro ao listar produtos:', error)
    return NextResponse.json({ message: 'Erro ao listar produtos' }, { status: 500 })
    }
}