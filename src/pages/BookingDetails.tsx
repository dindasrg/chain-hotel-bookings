import { useSearchParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, MapPin, Calendar, Users, Wallet, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useBooking } from "@/hooks/useBooking";
import { useHotel } from "@/hooks/useHotel";
import { useWeb3 } from "@/hooks/useWeb3";
import { LISK_SEPOLIA } from "@/lib/web3/config";
import hotelImage from "@/assets/hotel-1.jpg";

const BookingDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { account, isConnected } = useWeb3();
  
  const bookingId = searchParams.get("id");
  const { booking, loading: bookingLoading, error: bookingError } = useBooking(
    bookingId ? parseInt(bookingId) : null
  );
  const { hotel, loading: hotelLoading } = useHotel(booking?.hotelId || null);

  const loading = bookingLoading || hotelLoading;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12 pt-24">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Please connect your wallet to view booking details</p>
              <Button onClick={() => navigate("/find-hotels")}>
                Back to Hotels
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12 pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </main>
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12 pt-24">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">{bookingError || "Booking not found"}</p>
              <Button onClick={() => navigate("/find-hotels")}>
                Back to Hotels
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const roomClass = hotel?.roomClasses.find(rc => rc.id === booking.classId);
  const getStatus = () => {
    if (booking.roomReleased && booking.depositReleased) return "completed";
    if (booking.roomReleased) return "checked-in";
    if (booking.paidRoom) return "confirmed";
    return "pending";
  };

  const status = getStatus();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Booking Details</h1>
              <p className="text-muted-foreground">Booking ID: #{bookingId}</p>
            </div>
            <Badge 
              variant={status === "confirmed" ? "default" : "secondary"}
              className="text-lg px-4 py-2"
            >
              {status === "pending" && "⏳ Pending Check-in"}
              {status === "confirmed" && "✓ Confirmed"}
              {status === "checked-in" && "🏨 Checked In"}
              {status === "completed" && "✓ Completed"}
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hotel Info */}
              <Card className="overflow-hidden">
                <div className="aspect-[16/9] bg-muted relative">
                  <img 
                    src={hotelImage}
                    alt={hotel?.name || "Hotel"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-2">{hotel?.name || "Loading..."}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>On-chain Hotel</span>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Stay Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="font-semibold">Duration</span>
                      </div>
                      <span className="text-muted-foreground">{booking.nights} nights</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="font-semibold">Room Type</span>
                      <span className="text-muted-foreground">{roomClass?.name || `Class ${booking.classId}`}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Escrow Status */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wallet className="w-5 h-5 flex-shrink-0" />
                    Escrow Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium">Room Payment</span>
                      <Badge variant="outline" className="bg-background">
                        {booking.roomReleased ? "✓ Released to Hotel" : "🔒 Secured in Escrow"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium">Deposit</span>
                      <Badge variant="outline" className="bg-background">
                        {booking.depositReleased ? "✓ Processed" : "🔒 Held in Escrow"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {!booking.roomReleased 
                      ? "Your payment is securely held in the smart contract. Funds will be released to the hotel upon check-in confirmation."
                      : "Payment has been released. Your deposit will be refunded after checkout if no damages are reported."
                    }
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary hover:text-primary/80"
                    onClick={() => window.open(`${LISK_SEPOLIA.explorerUrl}/address/${booking.customer}`, '_blank')}
                  >
                    View on Explorer →
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Room Cost</span>
                    <span className="font-semibold">{booking.roomCost} USDC</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Deposit</span>
                    <span className="font-semibold">{booking.depositAmount} USDC</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center text-lg pt-2">
                    <span className="font-bold">Total Paid</span>
                    <span className="font-bold text-primary">
                      {(parseFloat(booking.roomCost) + parseFloat(booking.depositAmount)).toFixed(2)} USDC
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Connected Address</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-xs font-mono break-all leading-relaxed">
                        {account}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                {status === "confirmed" && (
                  <Button variant="outline" className="w-full" size="lg">
                    Request Cancellation
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate("/find-hotels")}
                >
                  Back to Search
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BookingDetails;
