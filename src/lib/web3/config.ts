// Lisk Sepolia Testnet Configuration
export const LISK_SEPOLIA = {
  chainId: import.meta.env.VITE_CHAIN_ID ? parseInt(import.meta.env.VITE_CHAIN_ID) : 4202,
  name: "Lisk Sepolia Testnet",
  currency: "ETH",
  explorerUrl: "https://sepolia-blockscout.lisk.com",
  rpcUrl: "https://rpc.sepolia-api.lisk.com",
};

// Panna SDK Configuration
export const PANNA_CONFIG = {
  clientId: import.meta.env.VITE_PANNA_CLIENT_ID || "7cb948c18beb24e6105880bdd3e734f0",
  partnerId: import.meta.env.VITE_PANNA_PARTNER_ID || "ff838874-df55-4b2e-8bfc-88df08f33296",
};

// Contract addresses - Update these with deployed contract addresses
export const CONTRACTS = {
  INNCHAIN: import.meta.env.VITE_INNCHAIN_CONTRACT || "0x8a44403EBE44F34Bc6CA5C79FF136bBEbd6E9773",
  USDC: import.meta.env.VITE_USDC_TOKEN || "0xD4fa9D0A762e1c94E6FbBb8f0Eeb090597147603",
};

// Contract ABIs - Using official ABI from smart contract
import InnChainArtifact from "./InnChain.json";
export const INNCHAIN_ABI = InnChainArtifact.abi;

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];
