import React from "react";
import { cn } from "@/lib/utils"; // Assuming we have cn, otherwise just use standard template literals

type Props = {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  isActive?: boolean;
};

export const ItemList = ({ children, title, action, isActive }: Props) => {
  return (
    <div className={`h-full w-full lg:flex-none lg:w-80 p-2 border-r bg-card flex-col ${isActive ? 'hidden lg:flex' : 'flex'}`}>
      <div className="mb-4 flex items-center justify-between p-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {action ? action : null}
      </div>
      <div className="w-full h-full flex flex-col gap-2 overflow-y-auto p-2">
        {children}
      </div>
    </div>
  );
};
