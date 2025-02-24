import { getETHBalanceAllNetworks } from "@/lib/alchemy";
import { prisma } from "@/prisma/prisma";
import { AggregateVote, Prisma, Vote } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { formatEther, parseEther } from "viem";

export async function POST(request: NextRequest) {
  const adminKey = request.headers.get('x-admin-key')

  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const vote: Vote | null = await prisma.vote.findFirst({
      orderBy: {
        updatedAt: 'asc',
      },
    });

    if (vote === null) {
      return NextResponse.json({ message: 'Votes updated successfully.' }, { status: 200 });
    }

    const { id, wallet, numVotes, proposalId, voteOption } = vote;

    const newNumVotes: bigint = await getETHBalanceAllNetworks(wallet);
    const previousNumVotes = parseEther(numVotes); // Convert string to bigint
    const diff = newNumVotes - previousNumVotes;

    if (diff > parseEther("1") || diff < parseEther("-1")) {
      console.warn(`Updating Balance for ${vote.wallet} for diff: ${formatEther(diff)} | new: ${formatEther(newNumVotes)} | old: ${numVotes}`);
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.vote.update({
        where: { id },
        data: {
          numVotes: formatEther(newNumVotes), // Store as string
          updatedAt: new Date(), // Update the timestamp
        },
      });

      let aggregateVote: AggregateVote | null = await tx.aggregateVote.findUnique({
        where: { proposalId },
      });

      if (!aggregateVote) {
        console.error('[Update] Aggregate vote not found for proposal:', proposalId);
        return;
      }

      // Lock the row to prevent race conditions
      await tx.$queryRaw`
          SELECT id FROM "aggregate_votes"
          WHERE "id" = ${aggregateVote.id}
          FOR UPDATE
        `;

      const currentTotalVotes = aggregateVote.totalVotes as Record<string, string>;

      const existingVotes = currentTotalVotes[voteOption]
        ? parseEther(currentTotalVotes[voteOption])
        : BigInt(0);

      // Calculate the new total
      const updatedVotes = existingVotes + diff;

      // Update the totalVotes object
      const newTotalVotes = {
        ...currentTotalVotes,
        [voteOption]: formatEther(updatedVotes),
      };

      // **iv. Update the `aggregate_votes` Row**
      await tx.aggregateVote.update({
        where: { id: aggregateVote.id },
        data: {
          totalVotes: newTotalVotes,
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json({ message: 'Votes updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
