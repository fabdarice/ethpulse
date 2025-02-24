"use client";

import { Clock, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Proposal } from '@/interfaces/Proposal';
import OneProposal from './OneProposal';
import Image from 'next/image';


export default function AllProposals() {
  const { toast } = useToast();
  const [activeProposals, setActiveProposals] = useState<Proposal[] | []>([]);
  const [pastProposals, setPastProposals] = useState<Proposal[] | []>([]);

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
    <div className="min-h-screen p-4 mb:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="mb-4">
              <Image src="/images/ethpulse.svg" width={300} height={100} alt="Ethereum Pulse" />
            </div>
            <p className="text-gray-600">
              Debate hot Ethereum topics and vote to capture the community’s signal.<br />No decentralized governance here, just insights.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Active Topics
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
            Past Topics
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
