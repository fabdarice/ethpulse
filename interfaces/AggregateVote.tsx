export interface AggregateVote {
  totalVotes: Record<string, string>;
  totalVoters: Record<string, number>;
  lastUpdated_at: Date;
}
