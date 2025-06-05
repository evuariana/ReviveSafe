import { Shield } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ReviveSafe
          </span>
        </div>
        <div className="mt-8 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-400">
            &copy; 2025 ReviveSafe. Built on Polkadot. Secure your future.
          </p>
        </div>
      </div>
    </footer>
  );
}
