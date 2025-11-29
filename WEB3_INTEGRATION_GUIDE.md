# InnChain Web3 Integration Guide

## Overview
InnChain is a decentralized hotel booking platform with escrow payments built on Lisk Sepolia Testnet. This guide covers the complete setup and integration process.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Material UI
- **Web3**: Panna SDK, Ethers.js v6
- **Blockchain**: Lisk Sepolia Testnet (Chain ID: 4202)
- **Smart Contract**: InnChain escrow system
- **Payment**: USDC stablecoin

## Architecture

### User Flow
1. **Customer Journey**
   - Browse hotels → Select room → Pay with USDC
   - Funds locked in escrow smart contract
   - Hotel sees booking + secured funds
   - Check-in confirmed → Room cost released to hotel
   - Deposit held for damages
   - Checkout → Deposit refunded or charged

2. **Hotel Staff Journey**
   - Search booking by ID
   - Confirm customer check-in → Releases room payment
   - After checkout: Refund full deposit OR charge for damages

### Smart Contract Features
- **Multi-Class Room System**: Hotels define room types with pricing
- **Escrow Payment**: Customer funds secured in contract
- **Tokenized Deposit**: USDC deposits for damages
- **Flexible Refund**: Full refund before check-in
- **Transparent**: All transactions on-chain

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root:

```env
# InnChain Contract Address (Lisk Sepolia)
VITE_INNCHAIN_CONTRACT=0x...

# USDC Token Address (Lisk Sepolia)
VITE_USDC_TOKEN=0x...
```

**Note**: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the browser.

### 2. Install Dependencies
Already installed:
- `panna-sdk@latest` - Web3 wallet connection
- `ethers@^6.13.0` - Ethereum interaction library

### 3. Smart Contract Deployment
Deploy the InnChain contract to Lisk Sepolia:
- Repository: https://github.com/Inn-Chain/innchain-contract
- Use Foundry for deployment
- Update contract address in `.env`

### 4. Wallet Setup
Users need:
- MetaMask or Web3-compatible wallet
- Lisk Sepolia testnet configured
- Test ETH for gas (get from Lisk faucet)
- USDC tokens for bookings

## Code Structure

### Web3 Integration Files

#### `src/lib/web3/config.ts`
Configuration for Lisk Sepolia network and contract addresses/ABIs.

#### `src/hooks/useWeb3.tsx`
React context and hook for wallet management:
- Connect/disconnect wallet
- Switch to Lisk Sepolia network
- Get contract instances
- Track connection state

#### `src/lib/web3/innchain.ts`
Helper functions for contract interaction:
- `approveUSDC()` - Approve USDC spending
- `createBooking()` - Customer creates booking
- `confirmCheckIn()` - Hotel confirms check-in
- `refundDeposit()` - Refund full deposit
- `chargeDeposit()` - Charge for damages
- `fullRefund()` - Cancel before check-in
- `getBooking()` - Fetch booking details
- Event listeners for real-time updates

### Pages

#### `/booking-details`
Customer view of their booking:
- Booking information and status
- Payment breakdown
- Escrow status (locked/released/refunded)
- Transaction history
- Cancel/refund options

#### `/hotel-staff`
Hotel staff check-in management:
- Search bookings by ID
- Confirm customer check-in
- Release room payment
- Process deposit settlement
- Charge for damages or refund

### Navigation Integration
Updated `src/App.tsx` to include:
- Web3Provider wrapper for wallet state
- Routes for new pages
- Global wallet context

## Usage Examples

### Customer Booking Flow
```typescript
import { useWeb3 } from "@/hooks/useWeb3";
import { createBooking, approveUSDC } from "@/lib/web3/innchain";

function BookingPage() {
  const { provider, account, isConnected } = useWeb3();
  
  const handleBooking = async () => {
    // 1. Approve USDC spending
    await approveUSDC(provider, "500"); // 500 USDC
    
    // 2. Create booking
    await createBooking(
      provider,
      1, // hotelId
      1, // roomClassId
      4, // nights
      "100" // deposit in USDC
    );
  };
}
```

### Hotel Check-in Flow
```typescript
import { confirmCheckIn } from "@/lib/web3/innchain";

function HotelStaffPage() {
  const { provider } = useWeb3();
  
  const handleCheckIn = async (bookingId: number) => {
    // Confirm check-in and release room cost
    await confirmCheckIn(provider, bookingId);
  };
}
```

### Deposit Settlement
```typescript
import { refundDeposit, chargeDeposit } from "@/lib/web3/innchain";

// No damages - refund full deposit
await refundDeposit(provider, bookingId);

// Damages occurred - charge 50 USDC, refund remainder
await chargeDeposit(provider, bookingId, "50");
```

## Contract Integration Checklist

- [ ] Deploy InnChain contract to Lisk Sepolia
- [ ] Deploy or use existing USDC token on Lisk Sepolia
- [ ] Update contract addresses in `.env`
- [ ] Test wallet connection
- [ ] Test USDC approval flow
- [ ] Test booking creation
- [ ] Test check-in confirmation
- [ ] Test deposit settlement
- [ ] Add event listeners for real-time updates
- [ ] Implement error handling for all transactions
- [ ] Add loading states during transactions
- [ ] Show transaction confirmations with explorer links

## Testing

### Local Testing
1. Connect MetaMask to Lisk Sepolia
2. Get test ETH from faucet
3. Get test USDC tokens
4. Test complete booking flow
5. Test hotel staff check-in
6. Test deposit settlements

### Contract Functions to Test
```bash
# Customer Actions
- createBooking(hotelId, classId, nights, deposit)
- fullRefund(bookingId) # before check-in

# Hotel Actions
- confirmCheckIn(bookingId)
- refundDeposit(bookingId)
- chargeDeposit(bookingId, amount)

# View Functions
- getBooking(bookingId)
- getHotel(hotelId)
- getRoomClass(hotelId, classId)
```

## Security Considerations

1. **Escrow Safety**: Funds locked in contract until conditions met
2. **Access Control**: Only authorized wallets can execute actions
3. **USDC Approval**: Users control spending limits
4. **Transaction Confirmation**: Always wait for confirmations
5. **Error Handling**: Proper handling of failed transactions
6. **Network Validation**: Ensure correct network (Lisk Sepolia)

## Next Steps

1. **Contract Deployment**
   - Deploy InnChain contract
   - Register hotels
   - Add room classes

2. **Frontend Enhancement**
   - Replace mock data with contract calls
   - Add real-time event listeners
   - Implement transaction status tracking
   - Add wallet balance displays

3. **UI/UX Improvements**
   - Transaction pending states
   - Success/error notifications
   - Explorer link integration
   - Gas estimation display

4. **Additional Features**
   - Hotel registration page
   - Room class management
   - Booking history
   - Customer dashboard
   - Analytics for hotels

## Resources

- **Lisk Sepolia Explorer**: https://sepolia-blockscout.lisk.com
- **Lisk Faucet**: Get test ETH for gas
- **InnChain Contract**: https://github.com/Inn-Chain/innchain-contract
- **Panna SDK Reference**: https://github.com/Ethereum-Jakarta/lisk-garden-dapp
- **Ethers.js Docs**: https://docs.ethers.org/v6/

## Support

For contract issues, refer to the InnChain contract repository.
For frontend integration help, check the Panna SDK examples.

---

**Flow Summary**: User selects hotel → Pays USDC → Escrow locks funds → Hotel confirms check-in → Room payment released → After checkout → Deposit refunded or charged → Transaction complete ✅
