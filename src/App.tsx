import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./hooks/useWeb3";
import Index from "./pages/Index";
import FindHotels from "./pages/FindHotels";
import HotelDetail from "./pages/HotelDetail";
import Booking from "./pages/Booking";
import BookingDetails from "./pages/BookingDetails";
import HotelStaffCheckin from "./pages/HotelStaffCheckin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/find-hotels" element={<FindHotels />} />
            <Route path="/hotel-detail" element={<HotelDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-details" element={<BookingDetails />} />
            <Route path="/hotel-staff" element={<HotelStaffCheckin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
