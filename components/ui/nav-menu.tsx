"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Menu, X } from "lucide-react";

export function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-7 md:px-0">
        <div className="flex justify-between h-16 items-center">

          {/* Logo & Home Link */}
          <div className="flex">
            <Link
              href="/"
              className="flex items-center text-gray-800 hover:text-gray-600 transition-colors"
            >
              <span className="font-medium">ALL TOPICS</span>
            </Link>
          </div>

          {/* Hamburger Icon for Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-gray-600 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <appkit-button />
            <Link
              href="/new"
              className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>New Topic</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Items */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 bg-white rounded-lg shadow-lg p-4">
            <appkit-button />
            <Link
              href="/new"
              className="flex items-center w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300"
              onClick={() => setIsOpen(false)}  // Close menu on click
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>New Topic</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
