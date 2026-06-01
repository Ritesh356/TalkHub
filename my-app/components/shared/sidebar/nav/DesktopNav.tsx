"use client";

import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const DesktopNav = () => {
  const paths = useNavigation();

  return (
    <div className="hidden lg:flex flex-col justify-between items-center h-full w-24 p-4 border-r bg-card">
      <nav className="flex flex-col gap-4 w-full items-center">
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
            <TooltipContent side="right">
              <p>{path.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
      <div className="flex flex-col gap-4 items-center">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
