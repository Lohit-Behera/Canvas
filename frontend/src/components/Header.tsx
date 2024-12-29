"use client";

import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";
import { LogIn, LogOut } from "lucide-react";
const ModeToggle = dynamic(
  () => import("@/components/ModeToggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
    loading: () => <Skeleton className="w-10 h-10" />,
  }
);

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background">
      <nav className="flex justify-between space-x-2">
        <SidebarTrigger />
        <div className="flex justify-end space-x-2">
          <Button
            variant={pathname === "/login" ? "default" : "outline"}
            size="sm"
            onClick={() => router.push("/login")}
          >
            <LogIn /> Login
          </Button>
          <Button
            variant={pathname === "/login" ? "default" : "outline"}
            size="sm"
          >
            <LogOut /> Logout
          </Button>
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Header;
