export interface AggregateVote {
  totalVotes: Record<string, string>;
  totalVoters: Record<string, number>;
  updatedAt: Date;
}
