import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const parroquias = await prisma.parroquia.findMany();
    return NextResponse.json(parroquias);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching parroquias:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching parroquias:", error);
      return NextResponse.json({ error: "Error fetching parroquias" }, { status: 500 });
    }
  }
}
