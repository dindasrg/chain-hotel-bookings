import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, MapPin, Calendar, Users, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const BookingDetails = () => {
  const navigate = useNavigate();
  
  // Mock booking data - will be replaced with actual data from contract
  const booking = {
    id: "BK-001234",
    status: "pending", // pending, confirmed, checked-in, completed
    hotel: {
      name: "Grand Lisk Hotel",
      address: "123 Blockchain Avenue, Crypto City",
      image: "/placeholder.svg",
    },
    room: {
      type: "Deluxe Suite",
      guests: 2,
    },
    dates: {
      checkIn: "2025-12-01",
      checkOut: "2025-12-05",
      nights: 4,
    },
    payment: {
      roomCost: 400, // in USDC
      deposit: 100, // in USDC
      total: 500,
      currency: "USDC",
    },
    customer: {
      wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    },
    escrowStatus: "locked", // locked, released, refunded
    transactionHash: "0xabc123...",
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
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Booking Details</h1>
              <p className="text-muted-foreground">Booking ID: {booking.id}</p>
            </div>
            <Badge 
              variant={booking.status === "confirmed" ? "default" : "secondary"}
              className="text-lg px-4 py-2"
            >
              {booking.status === "pending" && "⏳ Pending Check-in"}
              {booking.status === "confirmed" && "✓ Confirmed"}
              {booking.status === "checked-in" && "🏨 Checked In"}
              {booking.status === "completed" && "✓ Completed"}
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Hotel Info */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={booking.hotel.image} 
                    alt={booking.hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{booking.hotel.name}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.hotel.address}</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Stay Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold">Check-in</p>
                        <p className="text-muted-foreground">{booking.dates.checkIn}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold">Check-out</p>
                        <p className="text-muted-foreground">{booking.dates.checkOut}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Duration</span>
                    </div>
                    <span className="text-muted-foreground">{booking.dates.nights} nights</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Guests</span>
                    </div>
                    <span className="text-muted-foreground">{booking.room.guests} guests</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Room Type</span>
                    <span className="text-muted-foreground">{booking.room.type}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Escrow Status */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Escrow Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Payment Status</span>
                    <Badge variant="outline" className="bg-background">
                      {booking.escrowStatus === "locked" && "🔒 Funds Secured"}
                      {booking.escrowStatus === "released" && "✓ Released to Hotel"}
                      {booking.escrowStatus === "refunded" && "↩️ Refunded"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your payment is securely held in the smart contract escrow. Funds will be released to the hotel upon check-in confirmation.
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    onClick={() => window.open(`${booking.transactionHash}`, '_blank')}
                  >
                    View Transaction →
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Cost</span>
                    <span className="font-semibold">{booking.payment.roomCost} {booking.payment.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit</span>
                    <span className="font-semibold">{booking.payment.deposit} {booking.payment.currency}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total Paid</span>
                    <span className="font-bold text-primary">{booking.payment.total} {booking.payment.currency}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Connected Address</p>
                    <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                      {booking.customer.wallet}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button className="w-full" size="lg">
                    Contact Hotel
                  </Button>
                  {booking.status === "pending" && (
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
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BookingDetails;
