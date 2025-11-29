import { Contract, BrowserProvider, parseUnits, formatUnits } from "ethers";
import { CONTRACTS, INNCHAIN_ABI, ERC20_ABI } from "./config";

/**
 * InnChain Smart Contract Integration
 * 
 * This module provides helper functions to interact with the InnChain hotel booking
 * smart contract deployed on Lisk Sepolia testnet.
 * 
 * Flow:
 * 1. Customer approves USDC spending to InnChain contract
 * 2. Customer creates booking (funds locked in escrow)
 * 3. Hotel confirms check-in (room cost released to hotel)
 * 4. After checkout, hotel can:
 *    - Refund full deposit to customer
 *    - Charge deposit for damages (remainder refunded)
 * 5. Before check-in, customer/hotel/owner can initiate full refund
 */

export interface BookingData {
  customer: string;
  hotelId: number;
  classId: number;
  nights: number;
  roomCost: string; // in USDC
  depositAmount: string; // in USDC
  paidRoom: boolean;
  roomReleased: boolean;
  depositReleased: boolean;
}

export interface RoomClass {
  id: number;
  name: string;
  pricePerNight: string; // in USDC
}

export interface Hotel {
  id: number;
  name: string;
  wallet: string;
  roomClasses: RoomClass[];
  minPricePerNight: string;
}

/**
 * Approve USDC spending for InnChain contract
 * Must be called before creating a booking
 */
export async function approveUSDC(
  provider: BrowserProvider,
  amount: string // Amount in USDC (e.g., "100")
): Promise<any> {
  const signer = await provider.getSigner();
  const usdcContract = new Contract(CONTRACTS.USDC, ERC20_ABI, signer);
  
  const decimals = await usdcContract.decimals();
  const amountWei = parseUnits(amount, decimals);
  
  const tx = await usdcContract.approve(CONTRACTS.INNCHAIN, amountWei);
  return tx.wait();
}

/**
 * Check USDC allowance for InnChain contract
 */
export async function checkUSDCAllowance(
  provider: BrowserProvider,
  userAddress: string
): Promise<string> {
  const usdcContract = new Contract(CONTRACTS.USDC, ERC20_ABI, provider);
  const decimals = await usdcContract.decimals();
  const allowance = await usdcContract.allowance(userAddress, CONTRACTS.INNCHAIN);
  return formatUnits(allowance, decimals);
}

/**
 * Get USDC balance of user
 */
export async function getUSDCBalance(
  provider: BrowserProvider,
  userAddress: string
): Promise<string> {
  const usdcContract = new Contract(CONTRACTS.USDC, ERC20_ABI, provider);
  const decimals = await usdcContract.decimals();
  const balance = await usdcContract.balanceOf(userAddress);
  return formatUnits(balance, decimals);
}

/**
 * Create a new booking (customer action)
 * Transfers total payment (room cost + deposit) to escrow
 */
export async function createBooking(
  provider: BrowserProvider,
  hotelId: number,
  roomClassId: number,
  nights: number,
  deposit: string // in USDC
): Promise<number> {
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, signer);
  
  const depositWei = parseUnits(deposit, 18); // Contract uses 18 decimals for stable token
  const tx = await contract.createBooking(hotelId, roomClassId, nights, depositWei);
  const receipt = await tx.wait();
  
  // Extract booking ID from the BookingCreated event
  const event = receipt.logs.find((log: any) => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed?.name === "BookingCreated";
    } catch {
      return false;
    }
  });
  
  if (event) {
    const parsed = contract.interface.parseLog(event);
    return Number(parsed?.args[0]); // bookingId is the first indexed parameter
  }
  
  throw new Error("Booking created but ID not found in transaction");
}

/**
 * Confirm guest check-in (hotel action)
 * Releases room cost from escrow to hotel wallet
 */
export async function confirmCheckIn(
  provider: BrowserProvider,
  bookingId: number
): Promise<any> {
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, signer);
  
  const tx = await contract.confirmCheckIn(bookingId);
  return tx.wait();
}

/**
 * Refund full deposit to customer (hotel action after checkout)
 */
export async function refundDeposit(
  provider: BrowserProvider,
  bookingId: number
): Promise<any> {
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, signer);
  
  const tx = await contract.refundDeposit(bookingId);
  return tx.wait();
}

/**
 * Charge deposit for damages (hotel action after checkout)
 * Remainder is automatically refunded to customer
 */
export async function chargeDeposit(
  provider: BrowserProvider,
  bookingId: number,
  chargeAmount: string // in USDC
): Promise<any> {
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, signer);
  
  const amountWei = parseUnits(chargeAmount, 18);
  const tx = await contract.chargeDeposit(bookingId, amountWei);
  return tx.wait();
}

/**
 * Full refund before check-in (customer/hotel/owner action)
 * Returns both room cost and deposit to customer
 */
export async function fullRefund(
  provider: BrowserProvider,
  bookingId: number
): Promise<any> {
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, signer);
  
  const tx = await contract.fullRefund(bookingId);
  return tx.wait();
}

/**
 * Get booking details by ID
 */
export async function getBooking(
  provider: BrowserProvider,
  bookingId: number
): Promise<BookingData> {
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, provider);
  const result = await contract.getBooking(bookingId);
  
  return {
    customer: result[0],
    hotelId: Number(result[1]),
    classId: Number(result[2]),
    nights: Number(result[3]),
    roomCost: formatUnits(result[4], 18), // Contract uses 18 decimals
    depositAmount: formatUnits(result[5], 18),
    paidRoom: result[6],
    roomReleased: result[7],
    depositReleased: result[8],
  };
}

/**
 * Get all hotels with their room classes
 */
export async function getAllHotels(provider: BrowserProvider): Promise<Hotel[]> {
  try {
    const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, provider);
    const hotelsData = await contract.getAllHotelsWithDetails();

    return hotelsData.map((hotel: any) => {
      const roomClasses: RoomClass[] = hotel.classes.map((cls: any) => ({
        id: Number(cls.id),
        name: cls.name,
        pricePerNight: formatUnits(cls.pricePerNight, 18),
      }));

      return {
        id: Number(hotel.id),
        name: hotel.name,
        wallet: hotel.wallet,
        roomClasses,
        minPricePerNight: roomClasses.length > 0 
          ? Math.min(...roomClasses.map(rc => parseFloat(rc.pricePerNight))).toString()
          : "0"
      };
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw new Error("Failed to fetch hotels from blockchain");
  }
}

/**
 * Get hotel details by ID
 */
export async function getHotel(
  provider: BrowserProvider,
  hotelId: number
): Promise<Hotel> {
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, provider);
  const [registered, name, wallet] = await contract.getHotel(hotelId);
  
  // Get classes for this hotel
  const classIds = await contract.getHotelClasses(hotelId);
  const roomClasses: RoomClass[] = [];
  
  for (const classId of classIds) {
    const roomClass = await getRoomClass(provider, hotelId, Number(classId));
    roomClasses.push(roomClass);
  }
  
  return {
    id: hotelId,
    name,
    wallet,
    roomClasses,
    minPricePerNight: roomClasses.length > 0 
      ? Math.min(...roomClasses.map(rc => parseFloat(rc.pricePerNight))).toString()
      : "0"
  };
}

/**
 * Get room class details (global room classes)
 */
export async function getRoomClass(
  provider: BrowserProvider,
  hotelId: number,
  classId: number
): Promise<RoomClass> {
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, provider);
  const allClasses = await contract.getAllRoomClasses();
  
  // Find the class by ID
  const index = allClasses.ids.findIndex((id: bigint) => Number(id) === classId);
  
  if (index === -1) {
    throw new Error(`Room class ${classId} not found`);
  }
  
  return {
    id: classId,
    name: allClasses.names[index],
    pricePerNight: formatUnits(allClasses.prices[index], 18),
  };
}

/**
 * Listen to BookingCreated events
 */
export function listenToBookingCreated(
  provider: BrowserProvider,
  callback: (bookingId: number, hotelId: number, customer: string) => void
) {
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, provider);
  
  contract.on("BookingCreated", (bookingId, hotelId, customer) => {
    callback(Number(bookingId), Number(hotelId), customer);
  });
  
  return () => contract.removeAllListeners("BookingCreated");
}

/**
 * Listen to CheckInConfirmed events
 */
export function listenToCheckInConfirmed(
  provider: BrowserProvider,
  callback: (bookingId: number, roomCostReleased: string) => void
) {
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, provider);
  
  contract.on("CheckInConfirmed", (bookingId, roomCostReleased) => {
    callback(
      Number(bookingId), 
      formatUnits(roomCostReleased, 6)
    );
  });
  
  return () => contract.removeAllListeners("CheckInConfirmed");
}
