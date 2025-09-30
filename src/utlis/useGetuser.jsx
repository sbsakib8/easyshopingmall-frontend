"use client";

import { useEffect } from "react";
import { getUserProfile } from "../hook/useAuth";


// ✅ Custom hook
export const useGetUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setUser(data.user); 
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
 console.log(user);
  return { user, loading, error };
};