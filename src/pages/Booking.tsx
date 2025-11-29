import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Wallet, Lock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hotelImage from "@/assets/hotel-1.jpg";

const Booking = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-8">Complete Your Booking</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress Steps */}
                <div className="bg-card-dark rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-8">
                    {[
                      { num: 1, label: "Guest Details" },
                      { num: 2, label: "Payment" },
                      { num: 3, label: "Confirmation" },
                    ].map((s) => (
                      <div key={s.num} className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            step >= s.num
                              ? "bg-primary text-white"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {s.num}
                        </div>
                        <span className={`hidden md:block ${step >= s.num ? "text-white" : "text-white/50"}`}>
                          {s.label}
                        </span>
                        {s.num < 3 && (
                          <div className="hidden md:block w-16 h-0.5 bg-white/20 mx-4" />
                        )}
                      </div>
                    ))}
                  </div>

                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-4">Guest Information</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-white/70 block mb-2">First Name</label>
                          <Input
                            placeholder="John"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-white/70 block mb-2">Last Name</label>
                          <Input
                            placeholder="Doe"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-white/70 block mb-2">Email</label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/70 block mb-2">Phone Number</label>
                        <Input
                          placeholder="+1 234 567 890"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/70 block mb-2">Special Requests (Optional)</label>
                        <textarea
                          placeholder="Any special requirements..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white min-h-[100px]"
                        />
                      </div>
                      <Button
                        variant="hero"
                        size="lg"
                        className="w-full"
                        onClick={() => setStep(2)}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-4">Payment with USDC</h2>
                      
                      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                        <Lock className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="text-white font-medium mb-1">Escrow Protected Payment</p>
                          <p className="text-white/70 text-sm">
                            Your funds will be held securely in a smart contract escrow until check-in is verified.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-white/70 block mb-2">Your Wallet Address</label>
                        <Input
                          placeholder="0x..."
                          className="bg-white/5 border-white/10 text-white font-mono"
                        />
                      </div>

                      <div className="bg-white/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white">Amount to Pay</span>
                          <span className="text-2xl font-bold text-white">130 USDC</span>
                        </div>
                        <p className="text-white/70 text-sm">
                          This amount will be held in escrow and released to the hotel upon successful check-in.
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="hero"
                          size="lg"
                          className="flex-1"
                          onClick={() => setStep(3)}
                        >
                          <Wallet className="w-4 h-4 mr-2" />
                          Pay with USDC
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>
                      <p className="text-white/80 mb-8 max-w-md mx-auto">
                        Your booking has been confirmed and payment is secured in escrow. You will receive a confirmation email shortly.
                      </p>
                      <div className="bg-white/5 rounded-xl p-6 max-w-md mx-auto mb-8">
                        <div className="space-y-3 text-left">
                          <div className="flex justify-between text-white">
                            <span>Booking ID:</span>
                            <span className="font-mono">BK-2025-001234</span>
                          </div>
                          <div className="flex justify-between text-white">
                            <span>Status:</span>
                            <span className="text-primary font-medium">Confirmed</span>
                          </div>
                          <div className="flex justify-between text-white">
                            <span>Payment:</span>
                            <span className="text-primary font-medium">Held in Escrow</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="hero" size="lg" onClick={() => navigate('/booking-details')}>
                        View Booking Details
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card-dark rounded-2xl p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-white mb-4">Booking Summary</h3>
                  
                  <img
                    src={hotelImage}
                    alt="Hotel"
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />

                  <h4 className="text-lg font-bold text-white mb-2">Rimuru Hotel</h4>
                  
                  <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Nov 27 - Nov 28, 2025</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      1 Night • 2 Adults • 1 Room
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                    <div className="flex justify-between text-white">
                      <span>Room Rate</span>
                      <span>120 USDC</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Service Fee</span>
                      <span>10 USDC</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-bold text-white mb-4">
                    <span>Total</span>
                    <span>130 USDC</span>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <p className="text-sm text-white/80">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Protected by escrow until check-in
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
