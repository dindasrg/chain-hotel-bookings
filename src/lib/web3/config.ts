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
  INNCHAIN: import.meta.env.VITE_INNCHAIN_CONTRACT || "0x3dC787e67179E3d085eE4D363337116C5d7bb4D9",
  USDC: import.meta.env.VITE_USDC_TOKEN || "0x...", // Update with USDC address on Lisk Sepolia
};

// Contract ABIs
export const INNCHAIN_ABI = [
  // Hotel Management
  "function registerHotel(string memory name, address payable wallet) external returns (uint256)",
  "function linkHotelToClass(uint256 hotelId, uint256 classId) external",
  "function addGlobalRoomClass(string memory name, uint256 pricePerNight) external returns (uint256)",
  
  // Booking Functions
  "function createBooking(uint256 hotelId, uint256 classId, uint256 nights, uint256 depositAmount) external returns (uint256)",
  "function confirmCheckIn(uint256 bookingId) external",
  "function refundDeposit(uint256 bookingId) external",
  "function chargeDeposit(uint256 bookingId, uint256 amount) external",
  "function fullRefund(uint256 bookingId) external",
  
  // View Functions
  "function getHotel(uint256 hotelId) external view returns (bool registered, string name, address wallet, uint256 classCount)",
  "function getAllHotels() external view returns (uint256[] hotelIds, string[] hotelNames, address[] hotelWallets, uint256[][] hotelClassIds, string[][] hotelClassNames, uint256[][] hotelClassPrices)",
  "function getAllRoomClasses() external view returns (uint256[] ids, string[] names, uint256[] prices)",
  "function getHotelClasses(uint256 hotelId) external view returns (uint256[])",
  "function getBooking(uint256 bookingId) external view returns (address customer, uint256 hotelId, uint256 classId, uint256 nights, uint256 roomCost, uint256 depositAmount, bool paidRoom, bool roomReleased, bool depositReleased)",
  
  // Counters
  "function hotelCount() external view returns (uint256)",
  "function bookingCount() external view returns (uint256)",
  "function roomClassCount() external view returns (uint256)",
  
  // Events
  "event HotelRegistered(uint256 indexed hotelId, string name, address wallet)",
  "event HotelClassLinked(uint256 indexed hotelId, uint256 indexed classId)",
  "event RoomClassCreated(uint256 indexed classId, string name, uint256 pricePerNight)",
  "event BookingCreated(uint256 indexed bookingId, uint256 indexed hotelId, uint256 indexed classId, address customer, uint256 roomCost, uint256 depositAmount)",
  "event RoomPaymentReleased(uint256 indexed bookingId, uint256 amountToHotel)",
  "event DepositRefunded(uint256 indexed bookingId, uint256 amountToCustomer)",
  "event DepositCharged(uint256 indexed bookingId, uint256 amountToHotel, uint256 amountToCustomer)",
  "event FullRefund(uint256 indexed bookingId, uint256 totalRefund)",
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];
