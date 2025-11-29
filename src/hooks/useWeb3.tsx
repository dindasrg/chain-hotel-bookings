import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import { LISK_SEPOLIA, CONTRACTS, INNCHAIN_ABI, ERC20_ABI } from "@/lib/web3/config";

interface Web3ContextType {
  account: string | null;
  provider: BrowserProvider | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToLiskSepolia: () => Promise<void>;
  getInnChainContract: () => Contract | null;
  getUSDCContract: () => Contract | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const browserProvider = new BrowserProvider(window.ethereum);
        const accounts = await browserProvider.listAccounts();
        
        if (accounts.length > 0) {
          setProvider(browserProvider);
          const signer = await browserProvider.getSigner();
          setAccount(await signer.getAddress());
        }
      } catch (error) {
        console.error("Failed to check connection:", error);
      }
    }
  };

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask or another Web3 wallet");
      return;
    }

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(browserProvider);
      setAccount(address);

      // Switch to Lisk Sepolia
      await switchToLiskSepolia();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
  };

  const switchToLiskSepolia = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${LISK_SEPOLIA.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${LISK_SEPOLIA.chainId.toString(16)}`,
                chainName: LISK_SEPOLIA.name,
                nativeCurrency: {
                  name: LISK_SEPOLIA.currency,
                  symbol: LISK_SEPOLIA.currency,
                  decimals: 18,
                },
                rpcUrls: [LISK_SEPOLIA.rpcUrl],
                blockExplorerUrls: [LISK_SEPOLIA.explorerUrl],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Lisk Sepolia network:", addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  const getInnChainContract = () => {
    if (!provider || !account) return null;
    return new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, provider);
  };

  const getUSDCContract = () => {
    if (!provider || !account) return null;
    return new Contract(CONTRACTS.USDC, ERC20_ABI, provider);
  };

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnect();
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        isConnected: !!account,
        connect,
        disconnect,
        switchToLiskSepolia,
        getInnChainContract,
        getUSDCContract,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
