import { MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useNavigation = () => {
  const pathname = usePathname();
  const requests = useQuery(api.requests.get);
  const requestsCount = requests?.length || 0;

  const paths = useMemo(
    () => [
      {
        name: "Conversations",
        href: "/conversations",
        icon: <MessageSquare />,
        active: pathname.startsWith("/conversations"),
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <Users />,
        active: pathname.startsWith("/friends"),
        count: requestsCount,
      },
    ],
    [pathname, requestsCount]
  );

  return paths;
};
