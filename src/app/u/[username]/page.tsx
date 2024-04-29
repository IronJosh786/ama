"use client";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";

const Page = () => {
  const param = useParams();
  return (
    <div>
      <Navbar />
      <div>{param.username}</div>
    </div>
  );
};

export default Page;
