"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthUserNothave = ({ children }) => {
  const { data } = useSelector((state) => state.user); 
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      router.push("/");
    }
  }, [data, router]);

  
  return <>{children}</>;
};

export default AuthUserNothave;
