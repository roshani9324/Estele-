import { useEffect, useState } from "react";
import { getHomeData } from "../services/homeApi";

const useHome = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getHomeData();

        if (response?.success) {
          setHomeData(response.data);
        } else {
          throw new Error("Unable to load home page data.");
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return {
    homeData,
    loading,
    error,
  };
};

export default useHome;
