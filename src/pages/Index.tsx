import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock, Zap, Globe, MapPin, Wallet, CheckCircle, Hotel } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-hotel.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Safe, Instant Hotel Payments with{" "}
                <span className="text-primary">USDC Escrow</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your funds stay protected in escrow until check-in.
              </p>
              <Link to="/find-hotels">
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Find Hotels
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src={heroImage}
                alt="Luxury hotel with pool"
                className="rounded-2xl shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why InnChain Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why InnChain
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Escrow Protected</h3>
              <p className="text-white/90">
                Funds locked in smart contract until check-in.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Instant Settlement</h3>
              <p className="text-white/90">
                USDC payments settle in seconds, no chargebacks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No FX</h3>
              <p className="text-white/90">
                Pay in one currency globally.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">How it Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Choose Hotel</h3>
              <p className="text-muted-foreground">
                Browse and select your perfect accommodation
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Pay with USDC (escrow)</h3>
              <p className="text-muted-foreground">
                Secure payment held in smart contract escrow
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Check-in & verify</h3>
              <p className="text-muted-foreground">
                Verify your booking at hotel reception
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Hotel className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">4. Hotel</h3>
              <p className="text-muted-foreground">
                Enjoy your stay with peace of mind
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-8 text-sm">
            <a href="#" className="hover:text-accent transition-colors">Product</a>
            <a href="#" className="hover:text-accent transition-colors">Developers</a>
            <a href="#" className="hover:text-accent transition-colors">Legal</a>
            <a href="#" className="hover:text-accent transition-colors">Social</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
