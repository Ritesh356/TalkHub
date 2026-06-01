"use client";

import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const MobileNav = () => {
  const paths = useNavigation();

  return (
    <div className="flex lg:hidden justify-between items-center w-full h-16 px-4 border-t bg-card fixed bottom-0 left-0 z-50">
      <nav className="flex flex-row gap-4 items-center w-full justify-evenly">
        {paths.map((path, id) => (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <Button variant={path.active ? "default" : "ghost"} size="icon" className="relative w-12 h-12 rounded-2xl">
                <Link href={path.href} className="flex items-center justify-center w-full h-full">
                  {path.icon}
                </Link>
                {path.count ? (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card" />
                ) : null}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{path.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </nav>
    </div>
  );
};
