import apiClient from "../lib/axios";
import { useEffect, useState } from "react";

const useTeamSystemData = ({ search = "", limit = 10, page = 1 } = {}) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `/team-system?search=${search}&limit=${limit}&page=${page}`;
        const { data } = await apiClient.get(url, {
          withCredentials: true,
        });

        if (!data?.success) {
          throw new Error(data.error);
        }

        setData(data.data);
      } catch (error) {
        console.error("Team System Data Error: ", error);

        setError(error.message || "Something went wrong!");
        setData({});
      } finally {
        setIsLoading(false);
      }
    })();
  }, [search, limit, page]);

  return [isLoading, data, error];
};

export default useTeamSystemData;
