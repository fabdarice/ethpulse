"use client";

import { Github, Twitter } from "lucide-react";
import AllProposals from "@/components/AllProposal";


export default function Home() {
  return (
    <div className="min-h-screen p-3 pt-3">
      <AllProposals />
      <footer className="text-center mt-8 text-gray-600 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Github className="h-4 w-4" />
          <span>Code opensource on</span>
          <a
            href="https://github.com/fabdarice/ethpulse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            github
          </a>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Twitter className="h-4 w-4" />
          <span>Built by</span>
          <a
            href="https://x.com/fabdarice"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-0"
          >
            fabda.eth
          </a>
        </div>
      </footer>
    </div >
  );
}
