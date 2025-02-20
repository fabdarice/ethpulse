"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { Share2, Feather as Ethereum, Users, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatNumberWithCommas, timeAgo, truncateAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSignMessage } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

import { useParams } from 'next/navigation'
import { UserVote } from "@/interfaces/UserVote";
import { Proposal } from "@/interfaces/Proposal";
import { calculateTotalVoters, calculateTotalVotes } from "@/helpers/voteAggregation";
import { VotesByETH } from "@/components/VotesByETH";
import { Vote } from "@/interfaces/Vote";
import { VotesByNumber } from "@/components/VotesByNumber";

export default function ProposalPage() {

  const params = useParams()
  const proposalId = params.proposalId as string;

  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [userVote, setUserVote] = useState<UserVote | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);

  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const { signMessageAsync } = useSignMessage();
  const { open } = useAppKit();
  const [isLoading, setIsLoading] = useState(false);

  const [recentVotes, setRecentVotes] = useState<Vote[]>([]);

  console.log({ proposalId, userVote, proposal, recentVotes })

  useEffect(() => {
    const fetchProposal = async () => {
      const response = await fetch(`/api/proposals/${proposalId}`);
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Error fetching proposal",
          description: data.error,
          variant: "destructive"
        })
        return;
      }

      setProposal(data);
    }

    fetchProposal();
  }, [proposalId])

  useEffect(() => {
    if (!proposal || !proposal.aggregateVote || proposal.aggregateVote.totalVoters === null) return;

    const totalVoters = proposal?.aggregateVote.totalVoters;
  }, [proposal?.id])

  useEffect(() => {
    const fetchUserVote = async () => {
      if (isConnected && address) {
        try {
          const response = await fetch(`/api/votes/${proposalId}/${address}`);

          if (!response.ok) {
            toast({
              title: "Error fetching user's vote",
              description: response.statusText,
              variant: "destructive"
            })
            return;
          }

          const vote = await response.json();
          setUserVote(vote);
        } catch (error) {
          toast({
            title: "Error fetching user's vote",
            description: "",
            variant: "destructive"
          })
        }
      }
    };

    fetchUserVote();
  }, [isConnected, address, proposalId, userVote?.voteOption]);


  useEffect(() => {
    const fetchRecentVotes = async () => {
      try {
        const response = await fetch(`/api/votes/${proposalId}`);

        if (!response.ok) {
          toast({
            title: "Error fetching recent votes",
            description: response.statusText,
            variant: "destructive"
          })
          return;
        }

        const data = await response.json();
        setRecentVotes(data);

      } catch (error) {
        toast({
          title: "Error fetching recent votes",
          description: "",
          variant: "destructive"
        })
      }
    };

    fetchRecentVotes();
  }, [userVote?.voteOption, proposalId]);

  const handleVote = async (voteOption: string) => {
    if (!isConnected) {
      open();
      return;
    }

    try {
      setIsLoading(true);
      const voteMessage = `I vote ${voteOption} for "${proposal?.description}".\n\nSigning this transaction is free and will not cost you any gas.`;

      const signature = await signMessageAsync({
        message: voteMessage,
      });

      // Prepare the vote payload
      const votePayload = {
        proposalId,
        signature,
        wallet: address,
        voteOption,
      };

      // Call the API to submit the vote
      const response = await fetch(`/api/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(votePayload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Error voting",
          description: result.error,
          variant: "destructive"
        })
        return;
      }
      //
      console.log({ result })
      //
      setUserVote({
        voteOption: result.voteOption,
        numVotes: result.numVotes,
      });
      setShowVoteDialog(true);
    } catch (error) {
      toast({
        title: "Error voting",
        description: "",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };
  const handleShareTwitter = () => {
    if (!userVote) {
      return;
    }

    const tweetText = `I voted "${userVote.voteOption}" for "${proposal?.description}".\n\nhttps://www.ethpulse.io/proposals/${proposalId}`;
    const encodedTweet = encodeURIComponent(tweetText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTweet}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen p-3 pt-3">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 backdrop-blur-sm border border-blue-100">
        <h1 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          {proposal?.description}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Vote Distribution</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{formatNumberWithCommas(proposal ? calculateTotalVotes(proposal?.aggregateVote) : 0)} ETH</span>
                </div>
                <p className="text-gray-600">Total ETH Votes</p>
              </div>
              <div className="h-64">
                {proposal && <VotesByETH proposal={proposal} />}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Voter Participation</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{proposal ? calculateTotalVoters(proposal?.aggregateVote) : 0}</span>
                </div>
                <p className="text-gray-600">Total Voters</p>
              </div>
              <div className="h-64">
                {proposal && <VotesByNumber proposal={proposal} />}
              </div>
            </div>
          </div>
        </div>


        {userVote ? (
          <div className="rounded-lg text-center gap-4 pb-6">
            <h3 className="text-xl mb-4 text-gray-600">
              You voted <span className="text-green-500">{userVote.voteOption}</span> with {parseFloat(userVote.numVotes ?? "0").toFixed(5)} ETH
            </h3>
            <Button
              onClick={handleShareTwitter}
              className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white"
            >
              <Share2 className="mr-2" /> Share on Twitter
            </Button>
          </div>
        ) : (
          <div className="flex gap-6 justify-center mb-12">
            {proposal && proposal.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleVote(option)}
                className="group relative flex items-center overflow-hidden bg-white hover:bg-gray-50 text-gray-800 px-10 py-6 text-lg rounded-2xl shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-gray-100/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="font-medium tracking-wide">Vote {option}</span>
              </Button>

            ))}
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h2 className="text-xl font-semibold mb-4">
            Recent Votes
          </h2>
          <div className="space-y-4">
            {recentVotes.map((vote, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-blue-50 hover:border-blue-200 transition-colors duration-200"
              >
                {/* Wallet Address Section */}
                <div className="flex items-center mb-2 sm:mb-0">
                  <Ethereum className="mr-2 text-blue-500" />
                  {/* Truncate address on small screens */}
                  <span className="font-mono text-sm sm:text-base">
                    <span className="block sm:hidden">
                      {truncateAddress(vote.wallet, 4)}
                    </span>
                    <span className="hidden sm:block">{vote.wallet}</span>
                  </span>
                </div>

                {/* Vote and ETH Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span
                    className="text-sm sm:text-base font-medium text-green-500">
                    {vote.voteOption}
                  </span>
                  <span className="text-gray-600 text-sm sm:text-base">
                    {parseFloat(vote.numVotes.toString()).toFixed(4)} ETH
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                    {timeAgo(vote.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                How is my vote weighted?
              </AccordionTrigger>
              <AccordionContent>
                Votes are weighted based on the amount of ETH, ETH staked (beaconchain), ETH derivates in your connected wallet at the time of voting. The following blockchains are supported: $ETH (Ethereum, Base, Optimism, Arbitrum, zkSync, Linea), WETH (L1, Base, Optimism, Arbitrum), rETH (L1), stETH (L1, Base, Arbitrum, Optimism), Aave ETH (L1), Aave stETH (L1), Aave eETH (L1). This ensures that stakeholders with greater investments in the Ethereum ecosystem have a proportional influence on the outcome.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Is it safe to vote?
              </AccordionTrigger>
              <AccordionContent>
                Yes, voting is safe. The code is public and available&nbsp;
                <a
                  href="https://github.com/fabdarice/ethpulse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  here</a>.<br />
                It only requires a wallet signature.
                Signing this transaction is free and will not cost you any gas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">

                Do I need to pay any gas to vote?
              </AccordionTrigger>
              <AccordionContent>
                No, voting is completely free and does not require sending any transaction on-chain.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <Dialog open={showVoteDialog} onOpenChange={setShowVoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Vote!</DialogTitle>
          </DialogHeader>
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <h3 className="text-xl mb-4">
              You voted <span className="text-green-500">{userVote?.voteOption}</span> for "{proposal?.description}".
            </h3>
            <Button
              onClick={handleShareTwitter}
              className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white"
            >
              <Share2 className="mr-2" /> Share on Twitter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}


