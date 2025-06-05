// src/pages/wallets.tsx
import { useAccount, useBalance, useChainId } from "wagmi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Plus, ArrowRight, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReviveFactory } from "@/hooks/useReviveFactory";
import { useReviveWallet } from "@/hooks/useReviveWallet";
import { formatAddress, formatBalance } from "@/lib/utils";
import { getCurrentChainSymbol } from "@/lib/currency";
import { useState } from "react";
import { Address } from "viem";

function MultisigCard({ address, index }: { address: string; index: number }) {
  const chainId = useChainId();
  const { address: userAddress } = useAccount();
  const chainSymbol = getCurrentChainSymbol(chainId);
  const { owners, required, pendingCount, contractData } = useReviveWallet(
    address as Address
  );

  const { data: userBalance } = useBalance({ address: userAddress as Address });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {formatAddress(address as Address, 6)}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {contractData?.name || "Multisig Wallet"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(pendingCount || 0) > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {pendingCount} pending
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Balance</p>
              <p className="text-lg font-semibold text-blue-600">
                {userBalance ? formatBalance(userBalance.value) : "0.00"}{" "}
                {chainSymbol}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Threshold</p>
              <p className="text-lg font-semibold">
                {required || "..."} of {owners?.length || "..."} owners
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Owners</span>
              <span className="text-gray-900">{owners?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Pending Transactions</span>
              <span
                className={`font-medium ${
                  (pendingCount || 0) > 0 ? "text-orange-600" : "text-gray-900"
                }`}
              >
                {pendingCount || 0}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Link to={`/wallet/${address}`}>
              <Button className="w-full" variant="outline">
                Manage Wallet
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Wallets() {
  const { address } = useAccount();
  const chainId = useChainId();
  const chainSymbol = getCurrentChainSymbol(chainId);
  const { useMyMultisigs } = useReviveFactory();
  const { data: myMultisigsData, isLoading } = useMyMultisigs(address);
  const [searchTerm, setSearchTerm] = useState("");

  // Convert the data to array and ensure it's properly typed
  const myMultisigs = Array.isArray(myMultisigsData) ? myMultisigsData : [];

  const filteredMultisigs = myMultisigs.filter((addr: string) =>
    addr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Multisigs</h1>
          <p className="text-gray-600 mt-1">
            Manage your multisignature wallets and pending transactions
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      {myMultisigs.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && myMultisigs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="border-dashed border-2">
            <CardContent className="text-center py-12">
              <Shield className="h-16 w-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Multisigs Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You don't have any multisig wallets yet. Create your first one
                to start collaborating with your team on secure asset
                management.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Multisig
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Register Existing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Multisigs Grid */}
      {!isLoading && filteredMultisigs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMultisigs.map((address: string, index: number) => (
            <MultisigCard key={address} address={address} index={index} />
          ))}
        </div>
      )}

      {/* No Search Results */}
      {!isLoading &&
        myMultisigs.length > 0 &&
        filteredMultisigs.length === 0 &&
        searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-600">
                  No multisigs match your search for "{searchTerm}". Try a
                  different search term.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

      {/* Stats Summary */}
      {!isLoading && myMultisigs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {myMultisigs.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Wallets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {chainSymbol}
                  </div>
                  <div className="text-sm text-gray-600">Total Balance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-gray-600">Pending Actions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">Active Owners</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
