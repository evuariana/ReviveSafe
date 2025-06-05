// src/stores/revive.ts
import { create } from "zustand";
import { Address } from "viem";
import { MultisigData, Transaction, MultisigStats } from "../types/multisig";

interface ReviveStore {
  // State
  selectedMultisig: Address | null;
  multisigs: MultisigData[];
  transactions: Record<Address, Transaction[]>;
  stats: MultisigStats;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedMultisig: (address: Address | null) => void;
  setMultisigs: (multisigs: MultisigData[]) => void;
  addMultisig: (multisig: MultisigData) => void;
  updateMultisig: (address: Address, updates: Partial<MultisigData>) => void;
  setTransactions: (address: Address, transactions: Transaction[]) => void;
  addTransaction: (address: Address, transaction: Transaction) => void;
  updateTransaction: (
    address: Address,
    txId: number,
    updates: Partial<Transaction>
  ) => void;
  setStats: (stats: MultisigStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialStats: MultisigStats = {
  totalMultisigs: 0,
  totalBalance: 0n,
  pendingTransactions: 0,
  uniqueOwners: 0,
};

export const useReviveStore = create<ReviveStore>((set, get) => ({
  // Initial state
  selectedMultisig: null,
  multisigs: [],
  transactions: {},
  stats: initialStats,
  isLoading: false,
  error: null,

  // Actions
  setSelectedMultisig: (address) => set({ selectedMultisig: address }),

  setMultisigs: (multisigs) => {
    set({ multisigs });
    // Recalculate stats
    const stats: MultisigStats = {
      totalMultisigs: multisigs.length,
      totalBalance: multisigs.reduce((sum, m) => sum + m.balance, 0n),
      pendingTransactions: multisigs.reduce(
        (sum, m) => sum + m.pendingTransactions,
        0
      ),
      uniqueOwners: new Set(multisigs.flatMap((m) => m.owners)).size,
    };
    set({ stats });
  },

  addMultisig: (multisig) => {
    const { multisigs } = get();
    const updated = [...multisigs, multisig];
    get().setMultisigs(updated);
  },

  updateMultisig: (address, updates) => {
    const { multisigs } = get();
    const updated = multisigs.map((m) =>
      m.address === address ? { ...m, ...updates } : m
    );
    get().setMultisigs(updated);
  },

  setTransactions: (address, transactions) => {
    set((state) => ({
      transactions: {
        ...state.transactions,
        [address]: transactions,
      },
    }));
  },

  addTransaction: (address, transaction) => {
    const { transactions } = get();
    const existing = transactions[address] || [];
    get().setTransactions(address, [...existing, transaction]);
  },

  updateTransaction: (address, txId, updates) => {
    const { transactions } = get();
    const existing = transactions[address] || [];
    const updated = existing.map((tx) =>
      tx.id === txId ? { ...tx, ...updates } : tx
    );
    get().setTransactions(address, updated);
  },

  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      selectedMultisig: null,
      multisigs: [],
      transactions: {},
      stats: initialStats,
      isLoading: false,
      error: null,
    }),
}));
