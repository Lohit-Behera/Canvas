"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background">
      <nav className="flex justify-between space-x-2">
        <h1 className="text-lg">Logo</h1>
        <Button
          className=""
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </nav>
    </header>
  );
}

export default Header;
