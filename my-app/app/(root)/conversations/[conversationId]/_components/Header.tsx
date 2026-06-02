import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  imageUrl?: string;
  name: string;
};

export const Header = ({ imageUrl, name }: Props) => {
  return (
    <div className="w-full h-20 border-b flex items-center justify-between px-6 shrink-0 bg-blue-500/10">
      <div className="flex items-center gap-4">
        <Link href="/conversations" className="lg:hidden">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Avatar className="w-10 h-10 border-2 border-primary">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-semibold text-lg">{name}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </p>
        </div>
      </div>
      <div>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
