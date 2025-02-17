import { AggregateVote } from "./AggregateVote";

export interface Proposal {
  id: string;
  description: string;
  aggregateVotes: AggregateVote;
  createdAt: string;
  updatedAt: string;
  endAt: string;
}
