import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Wallet, 
  DollarSign,
  Clock,
  User,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { useWeb3 } from "@/hooks/useWeb3";
import { confirmCheckIn, getBooking, refundDeposit, chargeDeposit } from "@/lib/web3/innchain";
import { toast } from "sonner";

const HotelStaffCheckin = () => {
  const { account, provider, isConnected, connect } = useWeb3();
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const handleSearchBooking = async () => {
    if (!provider || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    
    setLoading(true);
    try {
      const booking = await getBooking(provider, parseInt(bookingId));
      setSelectedBooking(booking);
      toast.success("Booking found");
    } catch (error) {
      toast.error("Booking not found");
      setSelectedBooking(null);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheckin = async () => {
    if (!provider || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      await confirmCheckIn(provider, parseInt(bookingId));
      toast.success(`Check-in confirmed! ${selectedBooking.roomCost} USDC released to hotel.`);
      
      // Refetch booking to get updated status
      const updatedBooking = await getBooking(provider, parseInt(bookingId));
      setSelectedBooking(updatedBooking);
    } catch (error: any) {
      console.error(error);
      
      // Check for specific smart contract errors
      if (error.message?.includes("Hotel: only wallet")) {
        toast.error("Access Denied: This wallet is not authorized as the hotel's wallet. Only the registered hotel wallet can confirm check-ins.", {
          duration: 6000,
        });
      } else {
        toast.error(error.message || "Failed to confirm check-in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChargeDeposit = async (amount: number) => {
    if (!provider || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      await chargeDeposit(provider, parseInt(bookingId), amount.toString());
      
      const refund = parseFloat(selectedBooking.depositAmount) - amount;
      toast.success(`${amount} USDC charged from deposit. ${refund.toFixed(2)} USDC refunded to customer.`);
      
      // Refetch booking
      const updatedBooking = await getBooking(provider, parseInt(bookingId));
      setSelectedBooking(updatedBooking);
    } catch (error: any) {
      console.error(error);
      
      if (error.message?.includes("Hotel: only wallet")) {
        toast.error("Access Denied: This wallet is not authorized as the hotel's wallet.", {
          duration: 6000,
        });
      } else {
        toast.error(error.message || "Failed to charge deposit");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefundDeposit = async () => {
    if (!provider || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      await refundDeposit(provider, parseInt(bookingId));
      toast.success(`${selectedBooking.depositAmount} USDC refunded to customer.`);
      
      // Refetch booking
      const updatedBooking = await getBooking(provider, parseInt(bookingId));
      setSelectedBooking(updatedBooking);
    } catch (error: any) {
      console.error(error);
      
      if (error.message?.includes("Hotel: only wallet")) {
        toast.error("Access Denied: This wallet is not authorized as the hotel's wallet.", {
          duration: 6000,
        });
      } else {
        toast.error(error.message || "Failed to refund deposit");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Hotel Staff Check-in</h1>
              <p className="text-muted-foreground">Manage guest check-ins and escrow fund releases</p>
            </div>

            {/* Wallet Connection */}
            {!isConnected ? (
              <Alert className="mb-6">
                <Wallet className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Connect your hotel wallet to manage bookings</span>
                  <Button onClick={connect} size="sm">
                    Connect Wallet
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Card className="mb-6 bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Wallet Connected</p>
                      <p className="text-sm text-muted-foreground font-mono">{account}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Booking */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Search Booking</CardTitle>
                <CardDescription>Enter booking ID to manage check-in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="bookingId">Booking ID</Label>
                    <Input
                      id="bookingId"
                      placeholder="BK-001234"
                      value={bookingId}
                      onChange={(e) => setBookingId(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleSearchBooking} 
                    disabled={loading || !bookingId}
                    className="mt-auto"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            {selectedBooking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Booking {bookingId}</CardTitle>
                      <Badge 
                        variant={
                          !selectedBooking.roomReleased ? "secondary" : 
                          selectedBooking.roomReleased && !selectedBooking.depositReleased ? "default" : 
                          "outline"
                        }
                      >
                        {!selectedBooking.roomReleased && "⏳ Pending Check-in"}
                        {selectedBooking.roomReleased && !selectedBooking.depositReleased && "🏨 Checked In"}
                        {selectedBooking.depositReleased && "✓ Completed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer Information
                      </h3>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                        <p className="font-mono text-sm break-all">{selectedBooking.customer}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Stay Details */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Stay Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Room Class</p>
                          <p className="font-semibold">Class ID: {selectedBooking.classId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-semibold">{selectedBooking.nights} nights</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Hotel ID</p>
                          <p className="font-semibold">{selectedBooking.hotelId}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Info */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Payment Breakdown
                      </h3>
                      <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Room Cost</span>
                            <span className="font-semibold">{selectedBooking.roomCost} USDC</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Deposit (Escrow)</span>
                            <span className="font-semibold">{selectedBooking.depositAmount} USDC</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-lg">
                            <span className="font-bold">Total in Escrow</span>
                            <span className="font-bold text-primary">
                              {(parseFloat(selectedBooking.roomCost) + parseFloat(selectedBooking.depositAmount)).toFixed(2)} USDC
                            </span>
                          </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                      <h3 className="font-semibold mb-3">Actions</h3>
                      {!selectedBooking.roomReleased && (
                        <Button 
                          onClick={handleConfirmCheckin}
                          disabled={loading || !isConnected}
                          size="lg"
                          className="w-full"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Confirm Check-in & Release {selectedBooking.roomCost} USDC
                        </Button>
                      )}

                      {selectedBooking.roomReleased && !selectedBooking.depositReleased && (
                        <div className="space-y-3">
                          <Alert>
                            <Clock className="h-4 w-4" />
                            <AlertDescription>
                              Guest has checked in. Process deposit settlement after checkout.
                            </AlertDescription>
                          </Alert>
                          
                          <div className="grid md:grid-cols-2 gap-3">
                            <Button
                              onClick={handleRefundDeposit}
                              disabled={loading || !isConnected}
                              size="lg"
                              variant="outline"
                            >
                              <CheckCircle2 className="w-5 h-5 mr-2" />
                              Refund Full Deposit
                            </Button>
                            
                            <Button
                              onClick={() => handleChargeDeposit(50)}
                              disabled={loading || !isConnected}
                              size="lg"
                              variant="destructive"
                            >
                              <XCircle className="w-5 h-5 mr-2" />
                              Charge for Damages
                            </Button>
                          </div>
                        </div>
                      )}

                      {selectedBooking.depositReleased && (
                        <Alert>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>
                            This booking has been completed and all funds have been settled.
                          </AlertDescription>
                        </Alert>
                      )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HotelStaffCheckin;
