"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Users, ArrowRight, Plus, Clock, CheckCircle2, Coins } from "lucide-react";
import { Proposal } from '@/interfaces/Proposal';
import { calculateTotalVoters, calculateTotalVotes, displayColorsBasedOnVote } from '@/helpers/voteAggregation';
import { formatNumberWithCommas } from '@/lib/utils';

interface ProposalProps {
  proposal: Proposal;
  active: boolean;
}

export default function ProposalRow({ proposal, active }: ProposalProps) {
  return (
    <Card key={proposal.id} className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{proposal.description}</CardTitle>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${active
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
            }`}>
            {active ? "Active" : "Ended"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Total Voters</span>
            </div>
            <span className="text-lg font-semibold">{formatNumberWithCommas(calculateTotalVoters(proposal?.aggregateVote))}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Coins className="h-4 w-4" />
              <span className="text-sm">Total Votes</span>
            </div>
            <span className="text-lg font-semibold">{formatNumberWithCommas(calculateTotalVotes(proposal?.aggregateVote))} ETH</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-gray-600 mb-1 text-sm">End Date</div>
            <span className="text-lg font-semibold">{proposal.endAt}</span>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(proposal.aggregateVote.totalVotes).map(([option, votes]) => {
            const percentage = ((parseFloat(votes) / calculateTotalVotes(proposal?.aggregateVote)) * 100).toFixed(1);
            return (
              <div key={option} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{option}</span>
                  <span className="text-gray-600">{formatNumberWithCommas(votes)} ETH ({percentage}%)</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full ${displayColorsBasedOnVote(Number(percentage))} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      {active && (

        <CardFooter className="justify-end">
          <Link
            href={`/vote/${proposal.id}`}
            className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors group"
          >
            Vote Now
            <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardFooter>
      )}
    </Card>

  )
}
