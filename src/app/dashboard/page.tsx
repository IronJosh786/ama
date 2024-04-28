"use client";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();

  return (
    <div>
      <Button onClick={() => signOut()}>Signout</Button>
    </div>
  );
};
export default Page;
