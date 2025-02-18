import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

// app/api/votes/[proposalId]/route.ts
export async function GET(
  request: Request,
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

    const totalVoters = await prisma.vote.count({
      where: {
        proposalId,
      },
    });
    // Count the number of unique voters who voted "YES"
    const yesVoters = await prisma.vote.count({
      where: {
        proposalId,
        voteOption: "YES",
      },
    });

    // Count the number of unique voters who voted "NO"
    const noVoters = await prisma.vote.count({
      where: {
        proposalId,
        voteOption: "NO",
      },
    });

    return NextResponse.json({ votes, totalVoters, yesVoters, noVoters });
  } catch (error) {
    console.error('Could not fetch recent votes: ', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
