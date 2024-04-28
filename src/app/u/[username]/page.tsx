"use client";
import { useParams } from "next/navigation";

const Page = () => {
  const param = useParams();
  return <div>{param.username}</div>;
};

export default Page;
