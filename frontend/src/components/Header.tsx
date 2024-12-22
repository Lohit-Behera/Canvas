"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, PanelLeft } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <PanelLeft />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col w-[200px] md:w-[300px]"
          >
            <SheetHeader className="my-5">
              <SheetTitle>
                <Link href={"/"}>Logo</Link>
              </SheetTitle>
            </SheetHeader>
            <Collapsible>
              <CollapsibleTrigger
                asChild
                className="[&[data-state=open]>svg]:rotate-180"
              >
                <Button
                  className="w-full flex justify-between"
                  variant={"outline"}
                  size="sm"
                >
                  Product
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex justify-between my-2">
                <span className="w-[1px] bg-muted-foreground/50 ml-2" />
                <div className="w-[90%] flex flex-col justify-end space-y-2">
                  <Button
                    className="w-full flex justify-start"
                    variant={
                      pathname === "/create-product" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => router.push("/create-product")}
                  >
                    All Product
                  </Button>
                  <Button
                    className="w-full flex justify-start"
                    variant={pathname === "/product" ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push("/create-product")}
                  >
                    Add Product
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger
                asChild
                className="[&[data-state=open]>svg]:rotate-180"
              >
                <Button
                  className="w-full flex justify-between"
                  variant={"outline"}
                  size="sm"
                >
                  Blog
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex justify-between my-2">
                <span className="w-[1px] bg-muted-foreground/50 ml-2" />
                <div className="w-[90%] flex flex-col justify-end space-y-2">
                  <Button
                    className="w-full flex justify-start"
                    variant={
                      pathname === "/create-product" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => router.push("/create-product")}
                  >
                    All Product
                  </Button>
                  <Button
                    className="flex justify-start"
                    variant={
                      pathname === "/create-blog" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => router.push("/create-blog")}
                  >
                    Add Blog
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </SheetContent>
        </Sheet>
        <ModeToggle />
      </nav>
    </header>
  );
}

export default Header;
