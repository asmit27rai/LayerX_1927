import { createContext, useState } from 'react';

// Create context
export const MetaMaskContext = createContext<{ account: string | null; connectToMetaMask: () => Promise<void> }>({
  account: null,
  connectToMetaMask: async () => {},
});

// Create provider component
import type { PropsWithChildren } from 'react';

export const MetaMaskProvider = ({ children }: PropsWithChildren<{}>) => {
  const [account, setAccount] = useState(null);

  // Method to connect to MetaMask
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log('Connected to MetaMask account:', accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask!');
    }
  };

  return (
    <MetaMaskContext.Provider value={{ account, connectToMetaMask }}>
      {children}
    </MetaMaskContext.Provider>
  );
};