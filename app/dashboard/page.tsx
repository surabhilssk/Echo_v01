import { AppBar } from "../components/AppBar";
import { CreatorDashboard } from "../components/CreatorDashboard";

export default function DashboardPage() {
  return (
    <div>
      <div>
        <AppBar />
      </div>
      <div>
        <CreatorDashboard />
      </div>
    </div>
  );
}
