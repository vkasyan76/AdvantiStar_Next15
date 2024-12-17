// import { Button } from "@/components/ui/button";
// import Link from "next/link";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplatesGallery />
        {/* Click
        <Link href="/documents/123">
          <span className="text-blue-500 underline">&nbsp;here&nbsp;</span>
        </Link>{" "}
        to go to document id */}
      </div>
    </div>
  );
};

export default Home;
