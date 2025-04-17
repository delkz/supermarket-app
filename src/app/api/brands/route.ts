import path from "path";
import {promises as fs } from 'fs';
import { NextRequest, NextResponse } from "next/server";
import { Brand } from '@/types'
import { v4 as uuidv4 } from 'uuid'
export async function GET(req: NextRequest){
    try{
        const filepath = path.resolve(process.cwd(), 'src/data', 'brands.json');
        const data = await fs.readFile(filepath,'utf-8');
        const brands: Brand[] = JSON.parse(data);

        const searchParams = req.nextUrl.searchParams
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const start = (page - 1) * limit
        const end = start + limit

        const paginated = brands.slice(start, end)


        return NextResponse.json({
          data: paginated,
          total: brands.length,
          page,
          limit,
          hasNextPage: end < brands.length
        })
    }catch(err){
        console.error(err);
        return NextResponse.json({error:'Failed to load brands'}, {status: 500});
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ message: 'Nome da marca é obrigatório' }, { status: 400 });
        }

        const filepath = path.resolve(process.cwd(), 'src/data', 'brands.json');
        const data = await fs.readFile(filepath, 'utf-8');
        const brands: Brand[] = JSON.parse(data);

        const alreadyExists = brands.some((brand) => brand.name.toLowerCase() === name.toLowerCase());
        if (alreadyExists) {
            return NextResponse.json({ message: 'Marca já existe' }, { status: 400 });
        }

        const newBrand: Brand = {
            id: uuidv4(),
            name,
        };

        const updatedBrands = [...brands, newBrand];

        await fs.writeFile(filepath, JSON.stringify(updatedBrands, null, 2));

        return NextResponse.json(newBrand, { status: 201 });
    } catch (err) {
        console.error('Erro ao criar marca:', err);
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}