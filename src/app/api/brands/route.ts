import path from "path";
import {promises as fs } from 'fs';
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const filepath = path.join(process.cwd(),'data','brands.json');
        const data = await fs.readFile(filepath,'utf-8');
        const brands = JSON.parse(data);

        return NextResponse.json(brands);
    }catch(err){
        console.error(err);
        return NextResponse.json({error:'Failed to load brands'}, {status: 500});
    }
}