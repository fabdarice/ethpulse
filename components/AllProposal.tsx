"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Plus, Clock, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Proposal } from '@/interfaces/Proposal';
import OneProposal from './OneProposal';


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
        console.log({ active, past })
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
    <div className="min-h-screen p-8">
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
          <Link href="/new">
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
              <OneProposal key={proposal.id} proposal={proposal} active={true} />
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
              <OneProposal key={proposal.id} proposal={proposal} active={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
