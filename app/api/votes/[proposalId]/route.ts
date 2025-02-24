import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

// Fetch the most recent votes for a given proposal.
// app/api/votes/[proposalId]/route.ts
export async function GET(
  _: Request,
  { params: { proposalId } }: { params: { proposalId: string } }
) {
  try {
    const votes = await prisma.vote.findMany({
      where: {
        proposalId,
      },
      select: {
        wallet: true,
        voteOption: true,
        numVotes: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return NextResponse.json(votes);
  } catch (error) {
    console.error('Could not fetch recent votes: ', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
