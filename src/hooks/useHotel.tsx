import { useState, useEffect } from "react";
import { useWeb3 } from "./useWeb3";
import { getAllHotels, Hotel } from "@/lib/web3/innchain";

export const useHotel = (hotelId: number | null) => {
  const { provider, isConnected } = useWeb3();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!provider || !hotelId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const hotelsData = await getAllHotels(provider);
        const foundHotel = hotelsData.find(h => h.id === hotelId);
        
        if (!foundHotel) {
          throw new Error("Hotel not found");
        }
        
        setHotel(foundHotel);
      } catch (err) {
        console.error("Error fetching hotel:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch hotel");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [provider, hotelId]);

  return { hotel, loading, error };
};
