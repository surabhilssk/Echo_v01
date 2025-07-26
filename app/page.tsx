import { AppBar } from "./components/AppBar";
import { Hero } from "./components/Hero";
import { Redirect } from "./components/Redirect";

export default function Home() {
  return (
    <div>
      <AppBar />
      <Redirect />
      <Hero />
    </div>
  );
}
