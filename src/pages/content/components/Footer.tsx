import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@src/components/ui/tooltip";
import { FEEDBACK_URL } from "@src/constants";
import { Send } from "lucide-react";

export default function Footer() {
  return (
    <div className="relative flex items-center flex-none h-14 px-4">
      <div className="absolute left-0"></div>
      <div className="absolute right-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="icon-container icon-container-md text-foreground">
                <Send
                  className=""
                  onClick={() => {
                    window.open(FEEDBACK_URL, "_blank");
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>Give feedback</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
