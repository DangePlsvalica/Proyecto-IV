import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const consejos = await prisma.consejoComunal.findMany();
    return NextResponse.json(consejos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching consejos comunales:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching consejos comunales:", error);
      return NextResponse.json({ error: "Error fetching consejos comunales" }, { status: 500 });
    }
  }
}





