import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";
import innchainLogo from "@/assets/innchain-logo.png";

export const Navigation = () => {
  const location = useLocation();
  const isDarkPage = location.pathname.includes("hotels") || location.pathname.includes("booking");
  const { account, isConnected, connect, disconnect } = useWeb3();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkPage ? 'bg-secondary/95' : 'bg-background/95'} backdrop-blur-sm border-b border-border`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={innchainLogo} alt="InnChain" className="w-10 h-10" />
            <span className={`text-xl font-bold ${isDarkPage ? 'text-white' : 'text-foreground'}`}>
              InnChain
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${isDarkPage ? 'text-white hover:text-accent' : 'text-foreground hover:text-primary'}`}
            >
              Home
            </Link>
            <Link 
              to="/find-hotels" 
              className={`font-medium transition-colors ${isDarkPage ? 'text-white hover:text-accent' : 'text-foreground hover:text-primary'}`}
            >
              Hotels
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <Button 
                variant={isDarkPage ? "wallet" : "hero"} 
                size="lg"
                onClick={disconnect}
              >
                <Wallet className="w-4 h-4" />
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </Button>
            ) : (
              <Button 
                variant={isDarkPage ? "wallet" : "hero"} 
                size="lg"
                onClick={connect}
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
