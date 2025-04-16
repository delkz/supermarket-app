import path from "path";
import {promises as fs } from 'fs';
import { NextRequest, NextResponse } from "next/server";
import { Brand } from '@/types'

export async function GET(req: NextRequest){
    try{
        const filepath = path.join(process.cwd(),'data','brands.json');
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