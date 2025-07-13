import { AppBar } from "../components/AppBar";
import { DashboardComponent } from "../components/DasboardComponent";

export default function DashboardPage() {
  return (
    <div>
      <div>
        <AppBar />
      </div>
      <div>
        <DashboardComponent />
      </div>
    </div>
  );
}
