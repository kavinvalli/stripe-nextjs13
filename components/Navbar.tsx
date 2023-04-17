import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import SignInButton from "@/components/SignInButton";
import { Icons } from "./Icons";
import Image from "next/image";
import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const session = await getAuthSession();

  console.log(session);

  return (
    <nav className="flex justify-between items-center p-6 bg-slate-800 text-white">
      <Link href="/" className="font-bold">
        StriComm
      </Link>
      {session ? (
        <div className="flex items-center gap-4">
          <Link href="/cart" prefetch={false}>
            <Icons.cart />
          </Link>
          {
            // <Link href="/profile">
            //   <Image
            //     src={session.user.image || ""}
            //     width={40}
            //     height={40}
            //     alt={`${session.user.name}'s name`}
            //     className="rounded-full"
            //   />
            // </Link>
          }
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </nav>
  );
}
