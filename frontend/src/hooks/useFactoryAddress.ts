import { getAddress, isAddress, type Address } from "viem";
import { create } from "zustand";

const STORAGE_KEY = "revivesafe.factoryAddress";
const DEFAULT_FACTORY = import.meta.env.VITE_FACTORY_ADDRESS;

function normalize(value?: string | null): Address | undefined {
  if (!value || !isAddress(value)) {
    return undefined;
  }

  return getAddress(value);
}

interface FactoryAddressStore {
  factoryAddress: Address | undefined;
  defaultFactoryAddress: Address | undefined;
  hydrated: boolean;
  hydrate: () => void;
  setFactoryAddress: (value?: string) => void;
}

export const useFactoryAddress = create<FactoryAddressStore>((set) => ({
  factoryAddress: normalize(DEFAULT_FACTORY),
  defaultFactoryAddress: normalize(DEFAULT_FACTORY),
  hydrated: false,
  hydrate: () => {
    const stored = normalize(window.localStorage.getItem(STORAGE_KEY));
    set((state) => ({
      factoryAddress: stored ?? state.defaultFactoryAddress,
      hydrated: true,
    }));
  },
  setFactoryAddress: (value) => {
    const normalized = normalize(value);

    if (normalized) {
      window.localStorage.setItem(STORAGE_KEY, normalized);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    set({ factoryAddress: normalized, hydrated: true });
  },
}));
