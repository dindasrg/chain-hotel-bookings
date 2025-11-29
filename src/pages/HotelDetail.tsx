import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Wifi, Waves, Coffee, Car, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHotel } from "@/hooks/useHotel";
import { useWeb3 } from "@/hooks/useWeb3";
import { useState } from "react";
import { parseUnits } from "ethers";
import { createBooking, approveUSDC } from "@/lib/web3/innchain";
import { toast } from "sonner";
import hotelImage from "@/assets/hotel-1.jpg";
import heroImage from "@/assets/hero-hotel.jpg";

const HotelDetail = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const { provider, isConnected } = useWeb3();
  const { hotel, loading, error } = useHotel(id ? parseInt(id) : null);
  
  const [selectedRoomClass, setSelectedRoomClass] = useState<number | null>(null);
  const [nights, setNights] = useState(1);
  const [deposit, setDeposit] = useState("50");
  const [isBooking, setIsBooking] = useState(false);

  const amenities = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Waves, label: "Swimming Pool" },
    { icon: Coffee, label: "Restaurant" },
    { icon: Car, label: "Free Parking" },
  ];

  const handleBooking = async () => {
    if (!provider || !hotel || selectedRoomClass === null) {
      toast.error("Please connect wallet and select a room class");
      return;
    }

    const roomClass = hotel.roomClasses.find(rc => rc.id === selectedRoomClass);
    if (!roomClass) return;

    try {
      setIsBooking(true);
      
      // Calculate total
      const roomCost = parseFloat(roomClass.pricePerNight) * nights;
      const depositAmount = parseFloat(deposit);
      const total = roomCost + depositAmount;

      const approveToast = toast.loading("Approving USDC...");
      
      // Approve USDC
      await approveUSDC(provider, total.toString());
      
      toast.dismiss(approveToast);
      const bookingToast = toast.loading("Creating booking...");
      
      // Create booking
      const bookingId = await createBooking(
        provider,
        hotel.id,
        selectedRoomClass,
        nights,
        deposit
      );
      
      toast.dismiss(bookingToast);
      toast.success(`Booking created! ID: ${bookingId}`);
      
      // Navigate to booking details
      navigate(`/booking-details?id=${bookingId}`);
    } catch (err: any) {
      console.error("Booking error:", err);
      toast.dismiss();
      toast.error(err.message || "Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navigation />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navigation />
        <div className="pt-24 container mx-auto px-6">
          <div className="bg-card-dark rounded-2xl p-8 text-center">
            <p className="text-white text-lg">{error || "Hotel not found"}</p>
            <Button 
              variant="hero" 
              className="mt-4"
              onClick={() => navigate("/find-hotels")}
            >
              Back to Hotels
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const selectedRoom = hotel.roomClasses.find(rc => rc.id === selectedRoomClass);
  const roomCost = selectedRoom ? parseFloat(selectedRoom.pricePerNight) * nights : 0;
  const total = roomCost + parseFloat(deposit);

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            <img
              src={hotelImage}
              alt="Hotel exterior"
              className="w-full h-[400px] object-cover rounded-2xl"
            />
            <img
              src={heroImage}
              alt="Hotel pool"
              className="w-full h-[400px] object-cover rounded-2xl"
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Hotel Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card-dark rounded-2xl p-8"
              >
                <h1 className="text-4xl font-bold text-white mb-4">{hotel.name}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4 ? "fill-yellow-400 text-yellow-400" : "text-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white">4.7 (300 Reviews)</span>
                </div>

                <div className="flex items-center gap-2 text-white/70 mb-8">
                  <MapPin className="w-5 h-5" />
                  <span>123 Hotel Street, City Center, Downtown</span>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">About This Hotel</h2>
                  <p className="text-white/80 leading-relaxed">
                    Experience luxury and comfort at {hotel.name}. Our modern facilities and 
                    exceptional service ensure a memorable stay. Located in the heart of the 
                    city, we offer easy access to major attractions, shopping districts, and 
                    business centers. Each room is designed with your comfort in mind, featuring 
                    contemporary amenities and stunning city views.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Available Room Classes</h2>
                  <div className="space-y-3">
                    {hotel.roomClasses.map((roomClass) => (
                      <div
                        key={roomClass.id}
                        onClick={() => setSelectedRoomClass(roomClass.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedRoomClass === roomClass.id
                            ? "border-primary bg-primary/10"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold text-lg">{roomClass.name}</h3>
                            <p className="text-white/70 text-sm">Per night</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold text-2xl">{roomClass.pricePerNight} USDC</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 text-white">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <amenity.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span>{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Room Features</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {["Air Conditioning", "Flat-screen TV", "Mini Bar", "Room Service", "Safety Box", "City View"].map(
                      (feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-white">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span>{feature}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card-dark rounded-2xl p-6 sticky top-24">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-white mb-2">
                    {selectedRoom ? selectedRoom.pricePerNight : hotel.minPricePerNight} USDC
                    <span className="text-lg font-normal text-white/70">/night</span>
                  </div>
                  <p className="text-white/70">Prices protected in escrow until check-in</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm text-white/70 block mb-2">Number of Nights</label>
                    <input
                      type="number"
                      min="1"
                      value={nights}
                      onChange={(e) => setNights(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 block mb-2">Deposit Amount (USDC)</label>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                {selectedRoom && (
                  <div className="border-t border-white/10 pt-4 mb-6">
                    <div className="flex justify-between text-white mb-2">
                      <span>Room Cost ({nights} {nights === 1 ? 'night' : 'nights'})</span>
                      <span>{roomCost.toFixed(2)} USDC</span>
                    </div>
                    <div className="flex justify-between text-white mb-2">
                      <span>Deposit</span>
                      <span>{deposit} USDC</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white mt-4">
                      <span>Total</span>
                      <span>{total.toFixed(2)} USDC</span>
                    </div>
                  </div>
                )}

                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={handleBooking}
                  disabled={!isConnected || !selectedRoom || isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : !isConnected ? (
                    "Connect Wallet to Book"
                  ) : !selectedRoom ? (
                    "Select a Room Class"
                  ) : (
                    "Book Now"
                  )}
                </Button>
                
                <p className="text-sm text-white/70 text-center mt-4">
                  Secure payment with USDC escrow protection
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
