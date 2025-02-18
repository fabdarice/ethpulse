import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { verifySafeSignature, verifySignature } from '@/lib/ethereum';
import { getETHBalanceAllNetworks } from '@/lib/alchemy';
import { formatEther, parseEther } from 'viem';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { proposalId, signature, wallet, voteOption } = await request.json();

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });
    if (!proposal) {
      console.error('Proposal not found', proposalId);
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        proposalId,
        wallet,
      },
    });
    if (existingVote) {
      console.error('Already voted');
      return NextResponse.json({ error: 'Already voted' }, { status: 400 });
    }

    // 2) Verify signature
    const message = `I vote ${voteOption} for "${proposal.description}".\n\nSigning this transaction is free and will not cost you any gas.`;
    const isValidSignature = await verifySignature(message, signature, wallet);
    const isValidSignatureSafe = isValidSignature || (await verifySafeSignature(message, signature, wallet));

    if (!isValidSignature && !isValidSignatureSafe) {
      console.error('Invalid Signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log("ENTER 1")

    // 3) Calculate number of votes based on ETH holdings across EVM chains
    const numVotes: bigint = await getETHBalanceAllNetworks(wallet);
    console.log("ENTER 2")

    // 3) Use transaction WITH row-level locking
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // a) Create the vote record
      const vote = await tx.vote.create({
        data: {
          proposalId,
          wallet,
          signature,
          voteOption,
          numVotes: formatEther(numVotes),
        },
      });

      // b) Make sure there's an aggregateVote row to lock
      let currentAggregate = await tx.aggregateVote.findUnique({
        where: { proposalId },
      });
      if (!currentAggregate) {
        // Create one if it doesn't exist (so we have a row to lock)
        currentAggregate = await tx.aggregateVote.create({
          data: {
            proposalId,
            totalVotes: {}, // start empty or some default
            lastUpdatedAt: new Date(),
          },
        });
      }

      console.log("ENTER 3")

      // c) Lock that row in Postgres: SELECT ... FOR UPDATE
      //    This ensures only ONE transaction can modify it at a time.
      await tx.$queryRaw`
        SELECT id FROM "aggregate_votes" 
        WHERE "id" = ${currentAggregate.id} 
        FOR UPDATE
      `;
      console.log("ENTER 4")

      // d) Calculate the new totals
      const newTotalVotes = {
        // eslint-disable-next-line
        ...(currentAggregate.totalVotes as Record<string, string>),
        [voteOption]:
          // eslint-disable-next-line
          formatEther(parseEther((currentAggregate.totalVotes as Record<string, string>)[voteOption] || "0") + numVotes),
      };
      // Ensure total_voters is defined (if it can be undefined)
      const totalVoters = (currentAggregate.totalVoters ?? {}) as Record<string, number>;

      console.log("ENTER 5")

      const newTotalVoters = {
        ...totalVoters,
        [voteOption]: voteOption in totalVoters
          ? totalVoters[voteOption] + 1
          : 1,  // start at 1 if the key doesn't exist
      };


      // e) Update the row now that it's locked
      await tx.aggregateVote.update({
        where: { id: currentAggregate.id },
        data: {
          totalVotes: newTotalVotes,
          totalVoters: newTotalVoters,
        },
      });
      console.log("ENTER 6")

      return vote;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
