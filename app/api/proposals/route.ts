export const dynamic = 'force-dynamic';
import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';


export async function GET(_: Request) {
  try {
    const active = await prisma.proposal.findMany({
      where: {
        activated: true,
        end_at: { gt: new Date() },
      },
      include: {
        AggregateVote: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    const past = await prisma.proposal.findMany({
      where: {
        activated: true,
        end_at: { lte: new Date() },
      },
      include: {
        AggregateVote: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    console.log({ active, past })
    return NextResponse.json({ active, past });
  } catch (error) {
    console.error('Error fetching proposals: ', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

