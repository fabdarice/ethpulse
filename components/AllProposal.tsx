"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Plus, Clock, CheckCircle2, Coins } from "lucide-react";
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Proposal } from '@/interfaces/Proposal';
import ProposalRow from './Proposal';


// // Mock data for active proposals
// const activeProposals = [
//   {
//     id: 1,
//     title: "Danny Ryan as Executive Director",
//     description: "Vote for Danny Ryan as the sole Executive Director of the Ethereum Foundation",
//     totalVotes: 2000,
//     totalVoters: 1170,
//     endDate: "2025-04-30",
//     status: "Active",
//     options: [
//       { name: "Strongly Approve", votes: 800, color: "bg-green-500" },
//       { name: "Approve", votes: 700, color: "bg-green-300" },
//       { name: "Neutral", votes: 300, color: "bg-gray-400" },
//       { name: "Disapprove", votes: 150, color: "bg-red-300" },
//       { name: "Strongly Disapprove", votes: 50, color: "bg-red-500" }
//     ]
//   },
//   {
//     id: 2,
//     title: "Protocol Upgrade Proposal",
//     description: "EIP-9999: Implementing enhanced staking mechanisms for better network security",
//     totalVotes: 1500,
//     totalVoters: 890,
//     endDate: "2025-05-15",
//     status: "Active",
//     options: [
//       { name: "Strongly Approve", votes: 600, color: "bg-green-500" },
//       { name: "Approve", votes: 400, color: "bg-green-300" },
//       { name: "Neutral", votes: 200, color: "bg-gray-400" },
//       { name: "Disapprove", votes: 200, color: "bg-red-300" },
//       { name: "Strongly Disapprove", votes: 100, color: "bg-red-500" }
//     ]
//   },
//   {
//     id: 3,
//     title: "Treasury Allocation",
//     description: "Proposal to allocate 1000 ETH for ecosystem development grants",
//     totalVotes: 1200,
//     totalVoters: 650,
//     endDate: "2025-05-01",
//     status: "Active",
//     options: [
//       { name: "Strongly Approve", votes: 500, color: "bg-green-500" },
//       { name: "Approve", votes: 300, color: "bg-green-300" },
//       { name: "Neutral", votes: 200, color: "bg-gray-400" },
//       { name: "Disapprove", votes: 150, color: "bg-red-300" },
//       { name: "Strongly Disapprove", votes: 50, color: "bg-red-500" }
//     ]
//   }
// ];
//
// // Mock data for past proposals
// const pastProposals = [
//   {
//     id: 4,
//     title: "Network Fee Structure Update",
//     description: "Proposal to implement dynamic fee adjustment mechanism",
//     totalVotes: 3500,
//     totalVoters: 1800,
//     endDate: "2025-03-15",
//     status: "Passed",
//     result: "78% Approval"
//   },
//   {
//     id: 5,
//     title: "Governance Framework Update",
//     description: "Updates to the decision-making process for protocol changes",
//     totalVotes: 2800,
//     totalVoters: 1500,
//     endDate: "2025-03-01",
//     status: "Rejected",
//     result: "45% Approval"
//   }
// ];


export default function AllProposals() {
  const { toast } = useToast();
  const [activeProposals, setActiveProposals] = useState<Proposal[] | []>([]);
  const [pastProposals, setPastProposals] = useState<Proposal[] | []>([]);

  console.log({ activeProposals, pastProposals })

  useEffect(() => {
    const fetchAllProposals = async () => {
      try {
        const response = await fetch('/api/proposals');

        if (!response.ok) {
          toast({
            title: "Error fetching all proposals",
            description: response.statusText,
            variant: "destructive"

          });
          return
        }

        const { active, past } = await response.json();
        setActiveProposals(active);
        setPastProposals(past);
      } catch (error) {
        console.error('Error fetching proposals: ', error)
        toast({
          title: "Error fetching all proposals",
          description: "",
          variant: "destructive"
        })

      }
    }

    fetchAllProposals();
  }, [])


  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Governance Proposals
            </h1>
            <p className="text-gray-600">
              Participate in shaping the future of Ethereum through governance
            </p>
          </div>
          <Link href="/propose">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              New Proposal
            </Button>
          </Link>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Active Proposals
          </h2>
          <div className="grid gap-6">
            {activeProposals.map((proposal: Proposal) => (
              <ProposalRow key={proposal.id} proposal={proposal} active={true} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-gray-500" />
            Past Proposals
          </h2>
          <div className="grid gap-6">
            {pastProposals.map((proposal) => (
              <ProposalRow key={proposal.id} proposal={proposal} active={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
