import { AppBar } from "@/app/components/AppBar";
import { DashboardComponent } from "@/app/components/DasboardComponent";

export default async function ({
  params,
}: {
  params: Promise<{ creatorId: string }>;
}) {
  const { creatorId } = await params;
  return (
    <div>
      <AppBar />
      <DashboardComponent creatorId={creatorId} />
    </div>
  );
}
