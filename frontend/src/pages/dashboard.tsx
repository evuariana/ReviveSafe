// src/pages/dashboard.tsx
import { useEffect } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Clock,
  Wallet as WalletIcon,
  ArrowUpRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReviveFactory } from "@/hooks/useReviveFactory";
import { useReviveStore } from "@/stores/revive";
import { formatBalance } from "@/lib/utils";

export default function Dashboard() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { useMyMultisigs } = useReviveFactory();
  const { data: myMultisigs, isLoading } = useMyMultisigs(address);
  const { stats, setLoading } = useReviveStore();

  // Get user's balance (not multisig balance)
  const { data: userBalance } = useBalance({ address });

  // Get current chain info for currency symbol
  const getCurrentChainSymbol = () => {
    // You can expand this based on your supported chains
    switch (chainId) {
      case 420420421: // Your Polkadot testnet
        return "WND";
      case 1: // Ethereum mainnet
        return "ETH";
      default:
        return "WND"; // Default fallback
    }
  };

  const chainSymbol = getCurrentChainSymbol();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const myMultisigsArray = Array.isArray(myMultisigs) ? myMultisigs : [];
  const multisigCount = myMultisigsArray.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's an overview of your multisig wallets.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                My Multisigs
              </CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : multisigCount}
              </div>
              <p className="text-xs text-gray-600">
                {multisigCount === 0
                  ? "Create your first wallet"
                  : "Active wallets"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Your Balance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userBalance ? formatBalance(userBalance.value) : "0.00"}{" "}
                {chainSymbol}
              </div>
              <p className="text-xs text-gray-600">Personal wallet balance</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Actions
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.pendingTransactions}
              </div>
              <p className="text-xs text-gray-600">
                {stats.pendingTransactions === 0
                  ? "All caught up"
                  : "Require your attention"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Collaborators
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueOwners}</div>
              <p className="text-xs text-gray-600">Unique owners</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* My Multisigs & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Multisigs Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <WalletIcon className="h-5 w-5" />
                My Multisigs
              </CardTitle>
              {multisigCount > 0 && (
                <Link to="/wallets">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : multisigCount === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    No Multisigs Yet
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create your first multisig wallet to get started.
                  </p>
                  <Link to="/create">
                    <Button size="sm">Create Multisig</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myMultisigsArray
                    .slice(0, 3)
                    .map((address: string, index: number) => (
                      <motion.div
                        key={address}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                      >
                        <Link
                          to={`/wallet/${address}`}
                          className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm truncate">
                                {address.slice(0, 6)}...{address.slice(-4)}
                              </div>
                              <div className="text-xs text-gray-600">
                                MultiSig Wallet
                              </div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  {multisigCount > 3 && (
                    <Link to="/wallets">
                      <Button variant="ghost" size="sm" className="w-full">
                        View {multisigCount - 3} more
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent transactions</p>
                <p className="text-sm">
                  Transactions will appear here when you start using your
                  multisigs
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Getting Started Section (shown when no multisigs) */}
      {multisigCount === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="text-center py-12">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome to ReviveSafe!
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Get started by creating your first multisig wallet or
                  registering an existing one. Secure your assets with
                  collaborative governance.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <Link to="/create">
                  <Button>Create First Multisig</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline">Register Existing</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
