"use client";

import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
const ModeToggle = dynamic(
  () => import("@/components/ModeToggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
  }
);

function Header() {
  const router = useRouter();
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background">
      <nav className="flex justify-between space-x-2">
        <SidebarTrigger />
        <ModeToggle />
      </nav>
    </header>
  );
}

export default Header;
