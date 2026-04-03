'use client'
import Hero from "@/src/compronent/Home/Hero";
import DropShippingHome from "@/src/dropShipping/dropShippingHome/dropShippingHome";
import { useSelector } from "react-redux";

export default function HomeContent({ initialData }) {
  const user = useSelector((state) => state.user.data);
  const role = user?.role || 'USER';

  return (
    <>
      {role === "DROPSHIPPING" ? 
        <DropShippingHome initialData={initialData} /> : 
        <Hero initialData={initialData} />
      }
    </>
  );
}
