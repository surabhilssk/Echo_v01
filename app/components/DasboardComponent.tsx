import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/stateful-button";

export const DashboardComponent = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 h-screen pt-32">
        <div>
          <div className="text-2xl font-medium text-orange-100 pl-32">
            Upcoming Songs
          </div>
        </div>
        <div className="mr-48">
          <div className="flex justify-between">
            <div className="flex flex-col justify-center text-xl text-orange-100">
              Add a song
            </div>
            <ShimmerButton className="py-2 text-orange-100 px-3.5">
              <div className="flex">
                <div className="flex flex-col justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4 mr-1"
                  >
                    <path d="M12 6a2 2 0 1 0-1.994-1.842L5.323 6.5a2 2 0 1 0 0 3l4.683 2.342a2 2 0 1 0 .67-1.342L5.995 8.158a2.03 2.03 0 0 0 0-.316L10.677 5.5c.353.311.816.5 1.323.5Z" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center mt-0.5">Share</div>
              </div>
            </ShimmerButton>
          </div>
          <div>
            <Input
              placeholder="Paste YouTube link here"
              type="text"
              className="rounded-full border-orange-100 mt-6"
            />
            <Button className="bg-orange-950 text-orange-100 w-full mt-2">
              Add to queue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
