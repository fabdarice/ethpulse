export const dynamic = 'force-dynamic';
import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';


export async function GET(_: Request) {
  try {
    const active = await prisma.proposal.findMany({
      where: {
        activated: true,
        endAt: { gt: new Date() },
      },
      include: {
        aggregateVote: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const past = await prisma.proposal.findMany({
      where: {
        activated: true,
        endAt: { lte: new Date() },
      },
      include: {
        aggregateVote: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    console.log({ active, past })
    return NextResponse.json({ active, past });
  } catch (error) {
    console.error('Error fetching proposals: ', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const { title, options, endDate } = await request.json();

    const proposal = await prisma.proposal.create({
      data: {
        description: title,
        options,
        endAt: new Date(endDate),
      },
    });
    return NextResponse.json(proposal);
  } catch (error) {


    console.error('Error seeeding proposal: ', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
