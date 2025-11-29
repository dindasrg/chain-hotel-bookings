import { useState, useEffect } from "react";
import { useWeb3 } from "./useWeb3";
import { getAllHotels, Hotel } from "@/lib/web3/innchain";

export const useHotels = () => {
  const { provider, isConnected } = useWeb3();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      if (!provider) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const hotelsData = await getAllHotels(provider);
        setHotels(hotelsData);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [provider]);

  return { hotels, loading, error, refetch: () => provider && getAllHotels(provider).then(setHotels) };
};
