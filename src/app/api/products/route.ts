import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Brand, Product } from '@/types'
import { v4 as uuidv4 } from 'uuid'


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

        if (nameFilter) {
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, price, description, image, brandId } = body;

        if (!name || !price || !brandId) {
            return NextResponse.json({ message: 'Campos obrigatórios faltando' }, { status: 400 })
        }

        if (price <= 0) {
            return NextResponse.json({ message: 'Preço deve ser maior que 0' }, { status: 400 })
        }

        const brandsPath = path.join(process.cwd(), 'data', 'brands.json')
        const productsPath = path.join(process.cwd(), 'data', 'products.json')

        const [brandsData, productsData] = await Promise.all([
            fs.readFile(brandsPath, 'utf-8'),
            fs.readFile(productsPath, 'utf-8'),
        ])

        const brands: Brand[] = JSON.parse(brandsData)
        const products: Product[] = JSON.parse(productsData)

        const brandExists = brands.some((b) => b.id === brandId)
        if (!brandExists) {
            return NextResponse.json({ message: 'Marca não encontrada' }, { status: 400 })
        }

        const alreadyExists = products.some(
            (p) => p.name === name && p.brandId === brandId
        )
        if (alreadyExists) {
            return NextResponse.json({ message: 'Produto com essa marca já existe' }, { status: 400 })
        }

        const newProduct: Product = {
            id: uuidv4(),
            name,
            price,
            description,
            image,
            brandId,
        }

        const updatedProducts = [...products, newProduct]

        await fs.writeFile(productsPath, JSON.stringify(updatedProducts, null, 2))

        return NextResponse.json(newProduct, { status: 201 })


    } catch (error) {
        console.error('Erro ao criar produto:', error)
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
    }

};