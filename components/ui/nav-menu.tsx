import Link from 'next/link';
import { Home, Vote, Plus } from 'lucide-react';

export function NavMenu() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-4 text-gray-800 hover:text-gray-600 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              <span className="font-medium">ALL TOPICS</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">

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
      </div>
    </nav>
  );
}
