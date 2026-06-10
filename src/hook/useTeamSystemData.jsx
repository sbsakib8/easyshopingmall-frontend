import axios from "axios";
import { useEffect, useState } from "react";
import { UrlBackend } from "../confic/urlExport";

const useTeamSystemData = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `${UrlBackend}/team-system`;
        const { data } = await axios.get(url, {
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
  }, []);

  return [isLoading, data, error];
};

export default useTeamSystemData;
