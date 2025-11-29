// Lisk Sepolia Testnet Configuration
export const LISK_SEPOLIA = {
  chainId: 4202,
  name: "Lisk Sepolia Testnet",
  currency: "ETH",
  explorerUrl: "https://sepolia-blockscout.lisk.com",
  rpcUrl: "https://rpc.sepolia-api.lisk.com",
};

// Contract addresses - Update these with deployed contract addresses
export const CONTRACTS = {
  INNCHAIN: import.meta.env.VITE_INNCHAIN_CONTRACT || "0x...", // Update with actual address
  USDC: import.meta.env.VITE_USDC_TOKEN || "0x...", // Update with USDC address on Lisk Sepolia
};

// Contract ABIs
export const INNCHAIN_ABI = [
  "function registerHotel(address wallet) external",
  "function addRoomClass(uint256 hotelId, string memory name, uint256 pricePerNight) external",
  "function createBooking(uint256 hotelId, uint256 classId, uint256 nights, uint256 deposit) external",
  "function confirmCheckIn(uint256 bookingId) external",
  "function refundDeposit(uint256 bookingId) external",
  "function chargeDeposit(uint256 bookingId, uint256 amount) external",
  "function fullRefund(uint256 bookingId) external",
  "function getHotel(uint256 hotelId) external view returns (tuple(uint256 id, address wallet, bool isActive))",
  "function getRoomClass(uint256 hotelId, uint256 classId) external view returns (tuple(uint256 id, string name, uint256 pricePerNight, bool isActive))",
  "function getBooking(uint256 bookingId) external view returns (tuple(uint256 id, uint256 hotelId, uint256 roomClassId, address customer, uint256 nights, uint256 roomCost, uint256 deposit, bool checkedIn, bool settled, uint256 createdAt))",
  "event HotelRegistered(uint256 indexed hotelId, address indexed wallet)",
  "event RoomClassAdded(uint256 indexed hotelId, uint256 indexed classId, string name, uint256 pricePerNight)",
  "event BookingCreated(uint256 indexed bookingId, uint256 indexed hotelId, address indexed customer, uint256 roomCost, uint256 deposit)",
  "event CheckInConfirmed(uint256 indexed bookingId, uint256 roomCostReleased)",
  "event DepositRefunded(uint256 indexed bookingId, uint256 amount)",
  "event DepositCharged(uint256 indexed bookingId, uint256 charged, uint256 refunded)",
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];
