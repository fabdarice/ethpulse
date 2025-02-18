import { calculateTotalVotes, displayColorsBasedOnVote } from "@/helpers/voteAggregation";
import { Proposal } from "@/interfaces/Proposal";
import { formatNumberWithCommas } from "@/lib/utils";

interface VotesByETHProps {
  proposal: Proposal
}

export const VotesByETH = ({ proposal }: VotesByETHProps) => {
  return (

    <div className="space-y-3">
      {proposal.aggregateVote && (Object.entries(proposal.aggregateVote.totalVotes).map(([option, votes]) => {
        const totalVotes = calculateTotalVotes(proposal?.aggregateVote)
        const percentage = totalVotes !== 0 ? ((parseFloat(votes) / totalVotes) * 100).toFixed(1) : 0;
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
      }))}
    </div>
  )
}
