import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params: { proposalId, wallet } }: { params: { proposalId: string; wallet: string } }
) {
  try {
    const vote = await prisma.vote.findFirst({
      where: {
        proposalId,
        wallet,
      },
      select: {
        voteOption: true,
        numVotes: true,
      },
    });

    return NextResponse.json({ voteOption: vote?.vote_option, numVotes: vote?.num_votes });
  } catch (error) {
    console.error('Could not fetch vote: ', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
