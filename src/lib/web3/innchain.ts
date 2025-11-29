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
  id: number;
  hotelId: number;
  roomClassId: number;
  customer: string;
  nights: number;
  roomCost: string; // in USDC
  deposit: string; // in USDC
  checkedIn: boolean;
  settled: boolean;
  createdAt: number;
}

export interface RoomClass {
  id: number;
  name: string;
  pricePerNight: string; // in USDC
  isActive: boolean;
}

export interface Hotel {
  id: number;
  wallet: string;
  isActive: boolean;
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
): Promise<any> {
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, signer);
  
  const depositWei = parseUnits(deposit, 6); // USDC has 6 decimals
  const tx = await contract.createBooking(hotelId, roomClassId, nights, depositWei);
  return tx.wait();
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
  
  const amountWei = parseUnits(chargeAmount, 6);
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
  const booking = await contract.getBooking(bookingId);
  
  return {
    id: booking.id,
    hotelId: booking.hotelId,
    roomClassId: booking.roomClassId,
    customer: booking.customer,
    nights: booking.nights,
    roomCost: formatUnits(booking.roomCost, 6),
    deposit: formatUnits(booking.deposit, 6),
    checkedIn: booking.checkedIn,
    settled: booking.settled,
    createdAt: booking.createdAt,
  };
}

/**
 * Get hotel details by ID
 */
export async function getHotel(
  provider: BrowserProvider,
  hotelId: number
): Promise<Hotel> {
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, provider);
  const hotel = await contract.getHotel(hotelId);
  
  return {
    id: hotel.id,
    wallet: hotel.wallet,
    isActive: hotel.isActive,
  };
}

/**
 * Get room class details
 */
export async function getRoomClass(
  provider: BrowserProvider,
  hotelId: number,
  classId: number
): Promise<RoomClass> {
  const contract = new Contract(CONTRACTS.INNCHAIN, INNCHAIN_ABI, provider);
  const roomClass = await contract.getRoomClass(hotelId, classId);
  
  return {
    id: roomClass.id,
    name: roomClass.name,
    pricePerNight: formatUnits(roomClass.pricePerNight, 6),
    isActive: roomClass.isActive,
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
