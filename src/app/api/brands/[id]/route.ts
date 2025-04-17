import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Brand } from '@/types';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const brandsPath = path.resolve(process.cwd(), 'src/data', 'brands.json');
        const brandsData = await fs.readFile(brandsPath, 'utf-8');
        const brands: Brand[] = JSON.parse(brandsData);

        const brand = brands.find((b) => b.id === id);
        if (!brand) {
            return NextResponse.json({ message: 'Marca não encontrada' }, { status: 404 });
        }

        return NextResponse.json(brand, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar marca:', error);
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        const { name } = body;

        if (!name) {
            return NextResponse.json({ message: 'Nome da marca é obrigatório' }, { status: 400 });
        }

        const brandsPath = path.resolve(process.cwd(), 'src/data', 'brands.json');
        const brandsData = await fs.readFile(brandsPath, 'utf-8');
        const brands: Brand[] = JSON.parse(brandsData);

        const brandIndex = brands.findIndex((b) => b.id === id);
        if (brandIndex === -1) {
            return NextResponse.json({ message: 'Marca não encontrada' }, { status: 404 });
        }

        const alreadyExists = brands.some((b) => b.name.toLowerCase() === name.toLowerCase() && b.id !== id);
        if (alreadyExists) {
            return NextResponse.json({ message: 'Já existe uma marca com esse nome' }, { status: 400 });
        }

        const updatedBrand: Brand = {
            ...brands[brandIndex],
            name,
        };

        brands[brandIndex] = updatedBrand;

        await fs.writeFile(brandsPath, JSON.stringify(brands, null, 2));

        return NextResponse.json(updatedBrand, { status: 200 });
    } catch (error) {
        console.error('Erro ao atualizar marca:', error);
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const brandsPath = path.resolve(process.cwd(), 'src/data', 'brands.json');
        const brandsData = await fs.readFile(brandsPath, 'utf-8');
        const brands: Brand[] = JSON.parse(brandsData);

        const brandIndex = brands.findIndex((b) => b.id === id);
        if (brandIndex === -1) {
            return NextResponse.json({ message: 'Marca não encontrada' }, { status: 404 });
        }

        const updatedBrands = brands.filter((b) => b.id !== id);

        await fs.writeFile(brandsPath, JSON.stringify(updatedBrands, null, 2));

        return NextResponse.json({ message: 'Marca deletada com sucesso' }, { status: 200 });
    } catch (error) {
        console.error('Erro ao deletar marca:', error);
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}