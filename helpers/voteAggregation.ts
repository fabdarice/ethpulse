import { AggregateVote } from "@/interfaces/AggregateVote";

export function calculateTotalVotes(aggregateVote: AggregateVote): number {
  if (!aggregateVote) return 0;
  return Object.values(aggregateVote.totalVotes).reduce((acc, vote) => acc + Number(vote), 0);
}

export function calculateTotalVoters(aggregateVote: AggregateVote): number {
  if (!aggregateVote) return 0;
  return Object.values(aggregateVote.totalVoters).reduce((acc, voters) => acc + voters, 0);
}

export function displayColorsBasedOnVote(percentage: number): string {
  if (percentage >= 80) {
    return "bg-green-500";
  }
  if (percentage >= 60) {
    return "bg-green-300";
  }
  if (percentage >= 50) {
    return "bg-gray-400";
  }
  if (percentage >= 30) {
    return "bg-red-300";
  }
  return "bg-red-500";
}
