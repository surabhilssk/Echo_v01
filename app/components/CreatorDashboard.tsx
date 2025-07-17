"use client";

import { useSession } from "next-auth/react";
import { DashboardComponent } from "./DasboardComponent";

export const CreatorDashboard = () => {
  const session = useSession();
  return <DashboardComponent creatorId={session?.data?.user?.id || ""} />;
};
