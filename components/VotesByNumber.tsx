import { calculateTotalVoters, calculateTotalVotes, displayColorsBasedOnVote } from "@/helpers/voteAggregation";
import { Proposal } from "@/interfaces/Proposal";
import { formatNumberWithCommas } from "@/lib/utils";

interface VotesByNumberProps {
  proposal: Proposal
}

export const VotesByNumber = ({ proposal }: VotesByNumberProps) => {
  return (

    <div className="space-y-3">
      {proposal.aggregateVote && (Object.entries(proposal.aggregateVote.totalVoters).map(([option, votes]) => {
        const totalVoters = calculateTotalVoters(proposal?.aggregateVote)
        const percentage = totalVoters !== 0 ? ((votes / totalVoters) * 100).toFixed(1) : 0;
        const color = displayColorsBasedOnVote(Number(percentage));
        return (
          <div key={option} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{option}</span>
              <span className="text-gray-600">{formatNumberWithCommas(votes)} votes ({percentage}%)</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full ${color} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      }))}
    </div>
  )
}
