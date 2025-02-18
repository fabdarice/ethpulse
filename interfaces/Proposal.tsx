import { AggregateVote } from "./AggregateVote";

export interface Proposal {
  id: string;
  description: string;
  aggregateVote: AggregateVote;
  createdAt: string;
  updatedAt: string;
  endAt: string;
  options: string[];
}
