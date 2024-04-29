"use client";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="mx-auto flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome,{" "}
              <span className="capitalize">{user.username || user.email}</span>!
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-16 bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
