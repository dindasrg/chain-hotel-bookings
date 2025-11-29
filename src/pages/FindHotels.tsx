import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Calendar, Users, Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useHotels } from "@/hooks/useHotels";
import { useWeb3 } from "@/hooks/useWeb3";
import hotelImage from "@/assets/hotel-1.jpg";

const FindHotels = () => {
  const { connect, isConnected } = useWeb3();
  const { hotels, loading, error } = useHotels();

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      
      {/* Search Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search Hotels..."
                  className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </div>
            <Button variant="outline" className="ml-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
              Filter
            </Button>
          </div>

          {/* Search Filters */}
          <div className="bg-card-dark rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-white/70 mb-2 block">City, destination, or hotel name</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    placeholder="City, hotel, place to go"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">Check in & Check out Dates</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    defaultValue="Thu, 27 Nov 2025 - Fri, 28 Nov 2025"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">Guests and Rooms</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      defaultValue="2 Adult, 0 Child, 1 Room"
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <Button variant="hero" className="px-8">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel List Section */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Hotel List</h2>
            <p className="text-white/70">Look at this list hotel</p>
          </div>

          <div className="grid lg:grid-cols-[320px,1fr] gap-8">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card-dark rounded-2xl p-6 h-fit"
            >
              <h3 className="text-xl font-bold text-white mb-6">Filters</h3>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="text-white font-medium mb-3 block">Price Range</label>
                  <Slider defaultValue={[60, 360]} max={500} step={10} className="mb-4" />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/50 block mb-1">Min Price</label>
                      <Input defaultValue="$60" className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 block mb-1">Max Price</label>
                      <Input defaultValue="$360" className="bg-white/5 border-white/10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-white font-medium mb-3 block">Rating</label>
                  <div className="flex items-center gap-2">
                    <Checkbox id="rating" defaultChecked />
                    <label htmlFor="rating" className="text-white flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      4+
                    </label>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-white font-medium mb-3 block">amenities</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="wifi" />
                      <label htmlFor="wifi" className="text-white">WIFI</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="pool" />
                      <label htmlFor="pool" className="text-white">Pool</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="other" />
                      <label htmlFor="other" className="text-white">Other</label>
                    </div>
                  </div>
                </div>

                {/* Payment Option */}
                <div>
                  <label className="text-white font-medium mb-3 block">Payment Option</label>
                  <div className="flex items-center gap-2">
                    <Checkbox id="usdc" defaultChecked />
                    <label htmlFor="usdc" className="text-white">USDC</label>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hotel Cards */}
            <div className="space-y-6">
              {!isConnected ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card-dark rounded-2xl p-12 text-center"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
                  <p className="text-white/70 mb-6">Please connect your wallet to view available hotels</p>
                  <Button onClick={connect} variant="hero" size="lg">
                    Connect Wallet
                  </Button>
                </motion.div>
              ) : loading ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card-dark rounded-2xl p-12 text-center"
                >
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-white/70">Loading hotels from blockchain...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card-dark rounded-2xl p-12 text-center"
                >
                  <p className="text-red-400 mb-4">Error: {error}</p>
                  <p className="text-white/70">Please make sure you're connected to Lisk Sepolia testnet</p>
                </motion.div>
              ) : hotels.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card-dark rounded-2xl p-12 text-center"
                >
                  <p className="text-white/70">No hotels found</p>
                </motion.div>
              ) : (
                hotels.map((hotel, index) => {
                  const minPrice = hotel.roomClasses.length > 0 
                    ? Math.min(...hotel.roomClasses.map(c => parseFloat(c.pricePerNight)))
                    : 0;
                  
                  return (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card-dark rounded-2xl p-6 flex gap-6 hover:shadow-xl transition-shadow"
                    >
                      <img
                        src={hotelImage}
                        alt={hotel.name}
                        className="w-56 h-40 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1 flex items-center justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{hotel.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < 4
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-white/30"
                                }`}
                              />
                            ))}
                            <span className="text-white text-sm ml-1">4.5</span>
                          </div>
                          <p className="text-sm text-white/60 mb-3">
                            {hotel.roomClasses.length} room {hotel.roomClasses.length === 1 ? 'type' : 'types'} available
                          </p>
                          <p className="text-lg text-white">
                            From <span className="font-bold text-xl">{minPrice.toFixed(0)} USDC</span> / night
                          </p>
                        </div>
                        <Link to={`/hotel-detail?id=${hotel.id}`} className="flex-shrink-0">
                          <Button variant="hero" size="lg" className="px-8">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-8">
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="hero" size="icon">1</Button>
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white">2</Button>
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white">...</Button>
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindHotels;
