import { DesktopNav } from "./nav/DesktopNav";
import { MobileNav } from "./nav/MobileNav";

export const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full p-0 lg:p-4 flex flex-col lg:flex-row lg:gap-4">
      <DesktopNav />
      <MobileNav />
      <main className="h-[calc(100%-80px)] lg:h-full w-full flex lg:gap-4">
        {children}
      </main>
    </div>
  );
};
