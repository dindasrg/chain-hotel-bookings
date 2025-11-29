import { useState, useEffect } from "react";
import { useWeb3 } from "./useWeb3";
import { getBooking, BookingData } from "@/lib/web3/innchain";

export const useBooking = (bookingId: number | null) => {
  const { provider, isConnected } = useWeb3();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!provider || !bookingId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const bookingData = await getBooking(provider, bookingId);
        setBooking(bookingData);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [provider, bookingId]);

  const refetch = async () => {
    if (provider && bookingId) {
      try {
        const bookingData = await getBooking(provider, bookingId);
        setBooking(bookingData);
      } catch (err) {
        console.error("Error refetching booking:", err);
      }
    }
  };

  return { booking, loading, error, refetch };
};
