import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
};

export const ItemList = ({ children, title, action }: Props) => {
  return (
    <div className="h-full w-full lg:flex-none lg:w-80 p-2 border-r bg-card flex flex-col">
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
