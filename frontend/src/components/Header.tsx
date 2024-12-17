"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
const ModeToggle = dynamic(
  () => import("@/components/ModeToggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
  }
);

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background">
      <nav className="flex justify-between space-x-2">
        <Link href="/">
          <h1 className="text-lg">Logo</h1>
        </Link>
        <div className="flex space-x-2">
          <Button
            variant={pathname === "/create-product" ? "default" : "outline"}
            size="sm"
            onClick={() => router.push("/create-product")}
          >
            Create Product
          </Button>
          <Button
            variant={pathname === "/product" ? "default" : "outline"}
            size="sm"
            onClick={() => router.push("/product")}
          >
            Products
          </Button>
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Header;
