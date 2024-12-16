"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
const ModeToggle = dynamic(
  () => import("@/components/ModeToggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
  }
);

function Header() {
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background">
      <nav className="flex justify-between space-x-2">
        <Link href="/">
          <h1 className="text-lg">Logo</h1>
        </Link>
        <ModeToggle />
      </nav>
    </header>
  );
}

export default Header;
