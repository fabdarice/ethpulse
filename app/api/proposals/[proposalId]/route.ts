export const dynamic = 'force-dynamic';
import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';


export async function GET(
  _: Request,
  { params: { proposalId } }: { params: { proposalId: string } }
) {

  try {
    const proposal = await prisma.proposal.findMany({
      where: {
        proposalId,
      },
      include: {
        aggregateVote: true,
      },
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error(`Error fetching proposal ID ${proposalId}: `, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


