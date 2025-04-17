import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '@/types';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        const productsPath = path.resolve(process.cwd(), 'src/data', 'products.json');
        const productsData = await fs.readFile(productsPath, 'utf-8');
        const products: Product[] = JSON.parse(productsData);

        const product = products.find((p) => p.id === id);
        if (!product) {
            return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { name, price, description, image, brandId } = body;

        if (!name || !price || !brandId) {
            return NextResponse.json({ message: 'Campos obrigatórios faltando' }, { status: 400 });
        }

        if (price <= 0) {
            return NextResponse.json({ message: 'Preço deve ser maior que 0' }, { status: 400 });
        }

        const productsPath = path.resolve(process.cwd(), 'src/data', 'products.json');
        const productsData = await fs.readFile(productsPath, 'utf-8');
        const products: Product[] = JSON.parse(productsData);

        const productIndex = products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
        }

        const updatedProduct: Product = {
            ...products[productIndex],
            name,
            price,
            description,
            image,
            brandId,
        };

        products[productIndex] = updatedProduct;

        await fs.writeFile(productsPath, JSON.stringify(products, null, 2));

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        const productsPath = path.resolve(process.cwd(), 'src/data', 'products.json');
        const productsData = await fs.readFile(productsPath, 'utf-8');
        const products: Product[] = JSON.parse(productsData);

        const productIndex = products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
        }

        const updatedProducts = products.filter((p) => p.id !== id);

        await fs.writeFile(productsPath, JSON.stringify(updatedProducts, null, 2));

        return NextResponse.json({ message: 'Produto deletado com sucesso' }, { status: 200 });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}