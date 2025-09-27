import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Define the context type
interface BalanceContextType {
  userBalance: string;
  totalSupply: string;
  tokenName: string;
  tokenSymbol: string;
  setUserBalance: (balance: string) => void;
  setTotalSupply: (supply: string) => void;
  setTokenName: (name: string) => void;
  setTokenSymbol: (symbol: string) => void;
}

// Create the context
const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// Provider component
interface BalanceProviderProps {
  children: ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({
  children,
}) => {
  const [userBalance, setUserBalance] = useState<string>("0");
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");

  const value = {
    userBalance,
    totalSupply,
    tokenName,
    tokenSymbol,
    setUserBalance,
    setTotalSupply,
    setTokenName,
    setTokenSymbol,
  };

  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};

// Custom hook to use the balance context
export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};
